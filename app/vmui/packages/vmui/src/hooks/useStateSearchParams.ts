import { Dispatch, useState, useEffect, SetStateAction } from "preact/compat";
import { useSearchParams } from "react-router-dom";

/**
 * 从 query 参数取值并同步到本地 state
 * 
 * @param defaultState 
 * @param key 
 * @returns 
 */
const useStateSearchParams = <T>(defaultState: T, key: string): [T, Dispatch<SetStateAction<T>>] => {
  // 从路由上提取 query string
  const [searchParams] = useSearchParams();
  // 读取指定 key 的参数值
  const currentValue = searchParams.get(key) ? searchParams.get(key) as unknown as T : defaultState;
  // 保存值
  const [state, setState] = useState<T>(currentValue);

  // 当 query string 上的值更新时，同步更新 state
  useEffect(() => {
    if ((currentValue as unknown as T) !== state) {
      setState(currentValue as unknown as T);
    }
  }, [currentValue]);

  return [state, setState];
};

export default useStateSearchParams;
