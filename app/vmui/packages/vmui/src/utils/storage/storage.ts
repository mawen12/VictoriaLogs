import { StorageKeys, StorageValue } from "./types";
import { toPrefixedKey } from "./utils";

/**
 * 保存到 local storage
 * 
 * @param key 键
 * @param value 值
 * @param withPrefix 是否需要为 key 添加前缀 
 */
export const saveToStorage = (key: StorageKeys, value: StorageValue, withPrefix = true): void => {
  try {
    // 处理 key
    const storageKey = withPrefix ? toPrefixedKey(key) : key;

    if (value) {
      // keeping object in storage so that keeping the string is not different from keeping
      // 有值，则以 JSON 格式保存
      window.localStorage.setItem(storageKey, JSON.stringify({ value }));
    } else {
      // 没有值，则移除 key
      window.localStorage.removeItem(storageKey);
    }

    // 发布 local storage 值更新的事件
    window.dispatchEvent(new StorageEvent("storage", { key: storageKey, newValue: JSON.stringify({ value }) }));
  } catch (e) {
    console.error(e);
  }
};

/**
 * 
 * @param key 键
 * @param withPrefix 是否需要为 key 添加前缀
 * @returns 键对应的值
 */
export const getFromStorage = (key: StorageKeys, withPrefix = true): undefined | StorageValue => {
  // 处理 key
  const storageKey = withPrefix ? toPrefixedKey(key) : key;
  // 读取 key 的值
  const valueObj = window.localStorage.getItem(storageKey);

  // 没有值，返回 undefined
  if (valueObj === null) return undefined;

  try {
    // 保存时使用 JSON 格式，取出时通过 JSON 反序列化
    return JSON.parse(valueObj)?.value; // see comment in "saveToStorage"
  } catch (e) {
    return valueObj; // fallback for corrupted json
  }
};

/**
 * 
 * @param keys 键集合
 * @param withPrefix 是否需要为 key 添加前缀 
 */
export const removeFromStorage = (keys: StorageKeys[], withPrefix = true): void => {
  // 处理 key
  const storageKeys = withPrefix ? keys.map(toPrefixedKey) : keys;
  // 遍历并逐个移除
  storageKeys.forEach(k => {
    window.localStorage.removeItem(k);
    // 发布 local storage 值更新的事件
    window.dispatchEvent(new StorageEvent("storage", { key: k }));
  });
};
