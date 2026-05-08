import { useMemo, useRef } from "preact/compat";
import debounce from "lodash.debounce";
import { useUnmount } from "./useUnmount";

type DebounceOptions = {
  leading?: boolean;
  trailing?: boolean;
  maxWait?: number;
};

type ControlFunctions = {
  cancel: () => void;
  flush: () => void;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DebouncedState<T extends (...args: any) => any> = ((
  ...args: Parameters<T>
) => void) &
  ControlFunctions;

/**
 * 将任意函数包装为防抖回调，且保证一下：
 * 1.防抖实例本身稳定，不会因为每次渲染都重建
 * 2.实际执行时总是拿到最新的 func，不会出现闭包拿旧值的问题
 * 
 * 防抖回调还带有 cancel 和 flush，方便外部主动取消或立即执行
 * 
 * @param func 目标函数
 * @param delay 
 * @param options 
 * @returns 
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useDebounceCallback<T extends (...args: any) => any>(
  func: T,
  delay = 500,
  options?: DebounceOptions
): DebouncedState<T> {
  // 负责将最新的 func 提供给防抖函数
  const funcRef = useRef(func);
  // 每次渲染都更新为最新函数
  funcRef.current = func;

  const debounced = useMemo(() => {
    const debouncedFunc = debounce(
      // 防抖内部执行的是 funcRef.current，即之前指向的 func
      (...args: Parameters<T>) => funcRef.current(...args),
      delay,
      options
    );

    const wrapped: DebouncedState<T> = (...args: Parameters<T>) => {
      debouncedFunc(...args);
    };

    // 主动取消
    wrapped.cancel = debouncedFunc.cancel;
    // 立即执行
    wrapped.flush = debouncedFunc.flush;

    return wrapped;
  }, [delay, options]); // 仅依赖 delay 和 options，避免频繁重建防抖器

  // 组件卸载时自动 cancel，避免卸载后仍触发延迟调用（内存泄漏/状态更新警告来源）
  useUnmount(() => {
    debounced.cancel();
  });

  return debounced;
}
