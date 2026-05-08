import { useCallback } from "preact/compat";
import useEventListener from "./useEventListener";
import { useQueryDispatch } from "../state/query/QueryStateContext";

/**
 * 快速触发自动补全 的 hook
 * 
 * @returns 
 */
export const useQuickAutocomplete = () => {
  // QueryState 分发器
  const queryDispatch = useQueryDispatch();

  // 分发 SET_AUTOCOMPLETE_QUICK
  const setQuickAutocomplete = useCallback((value: boolean) => {
    queryDispatch({ type: "SET_AUTOCOMPLETE_QUICK", payload: value });
  }, [queryDispatch]);

  const handleKeyDown = (e: KeyboardEvent) => {
    /** @see AUTOCOMPLETE_QUICK_KEY */
    const { code, ctrlKey, altKey } = e;
    // 检测 Ctrl+Space 或 Alt+Space，命中时触发 setQuickAutocomplete
    if (code === "Space" && (ctrlKey || altKey)) {
      e.preventDefault();
      setQuickAutocomplete(true);
    }
  };

  // 监听 keydown 事件
  useEventListener("keydown", handleKeyDown);

  // 返回其用于调用方在按钮点击或其他场景手动触发
  return setQuickAutocomplete;
};
