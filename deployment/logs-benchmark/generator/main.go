package main

import (
	"bufio"
	"encoding/binary"
	"flag"
	"fmt"
	"log"
	"log/syslog"
	"math/rand"
	"net"
	"os"
	"strconv"
	"strings"
	"time"
)

var (
	logsPath     = flag.String("logsPath", "", "Path to logs directory")
	syslogAddr   = flag.String("syslog.addr", "logstash:12345", "Addr to send logs to")
	syslogAddr2  = flag.String("syslog.addr2", "logstash:12345", "Addr to send logs to")
	randomSuffix = flag.Bool("logs.randomSuffix", false, "Whether to add a random suffix to a log line")

	outputRateLimitItems  = flag.Int("outputRateLimitItems", 100, "Number of items to send per second")
	outputRateLimitPeriod = flag.Duration("outputRateLimitPeriod", time.Second, "Period of time to send items")
)

func main() {
	// 解析参数
	flag.Parse()

	// 记录开始时间
	startedAt := time.Now().Unix()

	// 读取日志路径
	logFiles, err := os.ReadDir(*logsPath)
	if err != nil {
		panic(fmt.Errorf("error reading directory %s:%w", *logsPath, err))
	}

	sourceFiles := make([]string, 0)

	// 遍历出以 .log 结尾的文件
	for _, logFile := range logFiles {
		if strings.HasSuffix(logFile.Name(), ".log") {
			sourceFiles = append(sourceFiles, logFile.Name())
		}
	}

	log.Printf("sourceFiles: %v", sourceFiles)
	log.Printf("running with rate limit: %d items per %s", *outputRateLimitItems, *outputRateLimitPeriod)

	limitTicker := time.NewTicker(*outputRateLimitPeriod)
	limitItems := *outputRateLimitItems
	limiter := make(chan struct{}, limitItems)

	// goroutine，每隔 outputRateLimitPeriod 向每个 outputRateLimitItems 的 limiter channel 投递空结构
	go func() {
		for {
			<-limitTicker.C
			for range limitItems {
				limiter <- struct{}{}
			}
		}
	}()

	// 
	for _, sourceFile := range sourceFiles {
		log.Printf("sourceFile: %s", sourceFile)
		// 打开 .log 文件
		f, err := os.Open(*logsPath + "/" + sourceFile)
		if err != nil {
			panic(err)
		}

		// 
		syslogTag := "logs-benchmark-" + sourceFile + "-" + strconv.FormatInt(startedAt, 10)

		// Loki uses RFC5424 syslog format, which has a 48 character limit on the tag.
		tagLen := len(syslogTag)
		if tagLen > 48 {
			truncate := tagLen - 48
			syslogTag = syslogTag[truncate:]
		}

		// 启动 tcp
		logger, err := syslog.Dial("tcp", *syslogAddr, syslog.LOG_INFO, syslogTag)
		if err != nil {
			panic(fmt.Errorf("error dialing syslog: %w", err))
		}

		// 启动 tcp
		logger2, err := syslog.Dial("tcp", *syslogAddr2, syslog.LOG_INFO, syslogTag)
		if err != nil {
			panic(fmt.Errorf("error dialing syslog: %w", err))
		}

		scanner := bufio.NewScanner(f)
		for scanner.Scan() {
			// 等待通知
			<-limiter
			// 读取写入的内容
			line := scanner.Text()
			// 完善写入的内容
			if *randomSuffix {
				line = line + " " + randomString()
			}
			// 写入消息
			_ = logger.Info(line)
			// 写入消息
			_ = logger2.Info(line)
		}

		// 关闭
		logger.Close()
		logger2.Close()
	}

}

func randomString() string {
	buf := make([]byte, 4)
	ip := rand.Uint32()

	binary.LittleEndian.PutUint32(buf, ip)
	return net.IP(buf).String()
}
