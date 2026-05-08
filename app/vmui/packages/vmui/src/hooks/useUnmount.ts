import { useEffect, useRef } from "preact/compat";

/**
 * 组件卸载时执行清理 hook
 * 
 * @param fn 
 */
export function useUnmount(fn: () => void) {
  // ref 保存回调
  const fnRef = useRef(fn);

  // fn 变化时，同步更新
  useEffect(() => {
    fnRef.current = fn;
  }, [fn]);

  useEffect(() => {
    // 组件卸载时执行回调
    return () => {
      fnRef.current();
    };
  }, []);
}
