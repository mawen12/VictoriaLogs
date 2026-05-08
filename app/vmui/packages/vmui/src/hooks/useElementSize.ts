import { useCallback, useEffect, useState } from "preact/compat";
import useEventListener from "./useEventListener";

export interface ElementSize {
    width: number
    height: number
}
/**
 * 提供一个可响应的元素尺寸读取器
 * 
 * @returns 
 */
const useElementSize = <T extends HTMLElement = HTMLDivElement>(): [(node: T | null) => void, ElementSize] => {
  // Mutable values like 'ref.current' aren't valid dependencies
  // because mutating them doesn't re-render the component.
  // Instead, we use a state as a ref to be reactive.
  // 保存目标节点引用，而非 useRef，这样节点变化会触发渲染
  const [ref, setRef] = useState<T | null>(null);
  // 使用 size 状态保存 width/height
  const [size, setSize] = useState<ElementSize>({
    width: 0,
    height: 0,
  });

  // Prevent too many rendering using useCallback
  const handleSize = useCallback(() => {
    setSize({
      width: ref?.offsetWidth || 0,
      height: ref?.offsetHeight || 0,
    });

  }, [ref?.offsetHeight, ref?.offsetWidth]);

  // 监听 resize 时重新计算尺寸
  useEventListener("resize", handleSize);

  // 在首次和依赖变化时重新计算尺寸
  useEffect(handleSize, [ref?.offsetHeight, ref?.offsetWidth]);

  return [setRef, size];
};

export default useElementSize;
