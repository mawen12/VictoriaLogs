import { useEffect, useRef } from "preact/compat";

/**
 * 返回某个值上一次渲染时的旧值
 * 
 * 执行顺序：
 *  1.渲染开始
 *  2.return ref.current （旧值）
 *  3.DOM 更新
 *  4.effect 执行
 *  5.ref.current = value （新值）
 * 
 * @param value 新值
 * @returns 旧值
 */
function usePrevious<T>(value: T): T | undefined {
  // 持久保存一个值，不触发渲染
  const ref = useRef<T>();
  
  // 渲染完成后，会触发 effect，此时更新为新值
  useEffect(() => {
    ref.current = value;
  }, [value]);

  // 每次渲染时，先执行函数体返回旧值
  return ref.current;
}

export default usePrevious;
