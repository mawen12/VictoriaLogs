import { useCallback, useEffect, useRef } from "preact/compat";

/**
 * 提供一个 当前组件是否还处于挂载状态的 hook
 * 
 * useRef.current 是可共享引用，异步回调读取到的是最新值
 * 
 * @returns 
 */
export function useIsMounted(): () => boolean {
  // 不能使用 useState，因为 useState 在组件挂载时可能产生问题
  const isMounted = useRef(false);

  useEffect(() => {
    // 组件挂载后在 effect 中把标记设置为 true
    isMounted.current = true;

    return () => {
      // 组件卸载时，不触发渲染地保存挂载状态
      isMounted.current = false;
    };
  }, []);

  // 返回一个稳定函数，方便外部随时判断
  return useCallback(() => isMounted.current, []);
}
