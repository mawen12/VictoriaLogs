# Setup

## 前端

`app/vmui/packages/vmui`

前端架构：

| 组件 | 用途 | 
| --- | --- |
| `Preact` | 轻量级的 `react`，核心 UI 框架 |
| `react-router-dom` | 客户端路由 |
| `react-input-mask` | 输入框掩码 |
| `uplot` | 高性能图表渲染 |
| `dayjs` | 轻量日期处理 |
| `qs` | URL 查询参数序列化/反序列化 |
| `classnames` | 条件拼接 css 类名的工具函数 |
| `lodash.debounce` | 防抖，避免短时间内频繁点击都发请求 |
| `lodash.throttle` | 节流，限制滚动/resize 等高频事件的处理频率 |
| `marked` | Markdown 渲染 |
| `vite` | 构建工具 |
| `web-vitals` | 采集 Core Web Vitals 性能指标 |

启动命令

```bash
npm run start
```

页面路由

| 路由 | 页面 |
| --- | --- |
| `/` | `QueryPage` |
| `/overview` | `OverviewPage` |
| `/stream-context` | `StreamContext` |
| `/icons` | `PreviewIcons` （仅开发环境） |
| `/buttons` | `AllButtonsPreview` （仅开发环境） |

## 后端

`app/victoria-logs`

后端架构：

| 组件 | 用途 |
| --- | --- |
| `VictoriaMetrics` | 核心基础库，HTTP 服务、日志、flag 解析、指标推送、进程信号等基础设施 |
| `easyproto` | 高性能 Protobuf 编解码 |
| `metrics` | 轻量 Prometheus 指标暴露库 |
| `xxhash/v2` | 极快的非加密哈希 |
| `readline` | 终端交互式输入 |
| `snappy` | Snappy 压缩/解压 |
| `go-cmp` | 深度比较两个值是否相等 |
| `compress` | 高性能 zstd/gzip/deflate 压缩 |
| `go-isatty` | 检测当前 stdout 是否为 TTY |
| `fastjson` | 零分配 JSON 解析 |
| `fastrand` | 无锁伪随机数生成器 |
| `quicktemplate` | 编译器模板渲染 |
| `yaml.v2` | YAML 配置解析 |


