import useEventListener from "./useEventListener";
import { useCallback, RefObject } from "preact/compat";

type Event = MouseEvent | TouchEvent;

/**
 * 监听 点击/触摸是否发生在目标元素外部，如果是外部，就执行传入的 handler
 * 
 * @param ref 目标元素
 * @param handler 当点击在目标元素外部时，要触发的回调
 * @param preventRef 排除区域
 */
const useClickOutside = <T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  handler: (event: Event) => void,
  preventRef?: RefObject<T> | null
) => {
  const listener = useCallback((event: Event) => {
    const el = ref?.current;
    const target = event.target as HTMLElement;
    const isPreventRef = preventRef?.current && preventRef.current.contains(target);

    // 判断点击/触摸是否发生在目标原始外部，或位于排除区域外
    if (!el || el.contains((event?.target as Node) || null) || isPreventRef) {
      return;
    }

    // 回调
    handler(event); // Call the handler only if the click is outside of the element passed.
  }, [ref, handler]);

  // 在 mouseup 上挂载监听
  useEventListener("mouseup", listener);
  // 在 touchstart 上挂载监听
  useEventListener("touchstart", listener);
};

export default useClickOutside;
