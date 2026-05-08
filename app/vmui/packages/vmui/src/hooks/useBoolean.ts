import { useCallback, useState, Dispatch, SetStateAction } from "preact/compat";

interface UseBooleanOutput {
  value: boolean
  setValue: Dispatch<SetStateAction<boolean>>
  setTrue: () => void
  setFalse: () => void
  toggle: () => void
}

/**
 * 提供 boolean 状态管理
 * 
 * @param defaultValue bool 默认值
 * @returns 
 */
const useBoolean = (defaultValue?: boolean): UseBooleanOutput => {
  // 转换为 bool 值存储到本地 state
  const [value, setValue] = useState(!!defaultValue);

  // 引用稳定
  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);
  const toggle = useCallback(() => setValue(x => !x), []);

  return { value, setValue, setTrue, setFalse, toggle };
};

export default useBoolean;
