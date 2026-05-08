import { useMemo, useState, useCallback } from "preact/compat";
import { getFromStorage, saveToStorage, StorageKeys } from "../utils/storage";
import useEventListener from "./useEventListener";

/**
 * A custom hook that synchronizes a boolean state with a value stored in localStorage.
 * 
 * 把 local storage 中的某个 boolean 值与 React 状态同步
 *
 * @param {StorageKeys} key - The key used to access the corresponding value in localStorage.
 * @param {(key: StorageKeys) => boolean} [customGetter] - Optional custom getter function used to read
 * @returns {[boolean, function]} A tuple containing the current boolean value from localStorage and a setter function to update the value in localStorage.
 *
 * The hook listens to the "storage" event to automatically update the state when the localStorage value changes.
 */
export const useLocalStorageBoolean = (
  key: StorageKeys,
  customGetter?: (key: StorageKeys) => boolean
): [boolean, (value: boolean) => void] => {

  const getter = useCallback((key: StorageKeys) => {
    // 默认从 local storage 读取，当 customGetter 传入时则从其获取
    return customGetter ? customGetter(key) : !!getFromStorage(key);
  }, [key, customGetter]);

  // 首次从 local storage 读取值初始化 value 状态
  const [value, setValue] = useState(getter(key));

  const handleUpdateStorage = useCallback(() => {
    // 读取值
    const newValue = getter(key);
    // 写入 
    if (newValue !== value) {
      setValue(newValue);
    }
  }, [key, value, getter]);

  // 写入 local storage，但不负责直接 setState
  const setNewValue = useCallback((newValue: boolean) => {
    saveToStorage(key, newValue);
  }, [key]);

  // 订阅 storage 事件，发生事件时，更新 value 状态
  useEventListener("storage", handleUpdateStorage);

  return useMemo(() => [value, setNewValue], [value, setNewValue]);
};
