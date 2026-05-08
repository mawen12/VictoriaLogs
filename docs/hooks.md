# Hooks

位于 `src/hooks` 目录下。

| hook | 用途 |
| --- | --- |
| `useBoolean` | 提供 boolean 的状态管理，是 `useState` 的仅针对 `boolean` 的特定实现 |
| `useClickOutside` | 监听点击/触摸是否发生在目标元素外部，如果是外部，就执行传入的 `handler` |
| `useCopyToClipboard` | 复制文本到剪切板，提供成功的提示反馈 |
| `useDebounceCallback` | 将任意函数包装为防抖回调 |
| `useDeviceDetect` | 判断当前是否应按移动端布局处理，并在窗口尺寸变化时自动更新结果 |
| `useDragResize` | 封装拖拽元素尺寸 |
| `useDropzone` | 封装全局拖拽/粘贴导入文件 |
| `useElementSize` | 提供一个可响应的元素尺寸读取器 |
| `useEventListener` | 通用事件订阅器 |
| `useFetchFlags` | 在应用初始化时读取配置文件并写入全局状态 |
| `useGetVersion` | 根据当期后端地址拉去版本信息，并把版本号暴露出去 |
| `useIsMounted` | 提供一个 当前组件是否还处于挂载状态的 hook |
| `useLocalStorageBoolean` | 把 local storage 中的某个 boolean 值与 React 状态同步 |
| `usePrevious` | 返回某个值上一次渲染时的旧值 |
| `useQuickAutocomplete` | 快速触发自动补全 的 hook |
| `useResizeObserver` | 监听 DOM 元素尺寸变化，并将新尺寸暴露给调用方 |
| `useSearchParamsFromObject` | query 同步封装的 hook |
| `useSortedCategories` | 做维度列的统计排序+按展示白名单过滤 的 hook |
| `useStateSearchParams` | 从 query 参数取值并同步到本地 state |
| `useThemeDetector` | 系统主题侦测 hook |
| `useTenant` | URL 租户参数适配 hook |
| `useUnmount` | 组件卸载时执行清理 hook |
| `useWindowSize` | 响应式的窗口尺寸监听 hook |
| `useDragChart` | 面向 uPlot 的高性能横向拖拽平移的 hook |
| `usePlotScale` | 把图表坐标范围安全地转换成查询时间区间，保持 UI 与全局时间状态同步 hook |
| `useReadyChart` | uPlot 交互接入层 hook，负责把受控条件下的拖拽平移+光标锚点滚轮缩放转换为同一的 setPlotScale 更新 |
| `useZoomChart` | 图标缩放交互控制器 hook |