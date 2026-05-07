package main

import (
	"embed"
	"flag"
	"log"
	"net/http"
)

// specific files
// static content
//
//go:embed favicon.svg robots.txt index.html manifest.json asset-manifest.json
//go:embed static
var files embed.FS

var listenAddr = flag.String("listenAddr", ":8080", "defines listen addr for http server, default to :8080")

func main() {
	// 解析配置 listenAddr
	flag.Parse()

	// 创建 http
	handler := http.NewServeMux()
	// / -> files
	handler.Handle("/", http.FileServer(http.FS(files)))
	// /health -> 返回 OK
	handler.HandleFunc("/health", func(writer http.ResponseWriter, request *http.Request) {
		writer.WriteHeader(http.StatusOK)
		_, _ = writer.Write([]byte(`OK`))
	})
	log.Printf("starting web server at: %v", *listenAddr)
	log.Fatal(http.ListenAndServe(*listenAddr, handler))
}
