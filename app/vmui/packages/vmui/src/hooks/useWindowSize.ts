import { useEffect, useState } from "preact/compat";
import useEventListener from "./useEventListener";

interface WindowSize {
    width: number
    height: number
}

/**
 * 响应式的窗口尺寸监听 hook
 * 
 * @returns 
 */
const useWindowSize = (): WindowSize => {
  // 构造保存 windowSize 的状态
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: 0,
    height: 0,
  });

  const handleSize = () => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };

  // 监听 resize 事件，在变化时，更新 windowSize 
  useEventListener("resize", handleSize);

  // Set size at the first client-side load
  // 组件加载后，执行初始化
  useEffect(handleSize, []);

  return windowSize;
};

export default useWindowSize;
