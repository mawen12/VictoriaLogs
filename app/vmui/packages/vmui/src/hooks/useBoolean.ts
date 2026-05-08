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
  // 维护 boolean 类型的状态
  const [value, setValue] = useState(!!defaultValue);

  // 引用稳定
  // 操作 boolean 值的方法
  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);
  const toggle = useCallback(() => setValue(x => !x), []);

  return { value, setValue, setTrue, setFalse, toggle };
};

export default useBoolean;
