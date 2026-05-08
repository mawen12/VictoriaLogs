import { useNavigate, useSearchParams } from "react-router-dom";
import { useCallback } from "preact/compat";


/**
 * query 同步封装的 hook
 * 
 * @returns 
 */
const useSearchParamsFromObject = () => {
  // 导航能力
  const navigate = useNavigate();
  // 当前 query 参数
  const [searchParams, setSearchParams] = useSearchParams();

  // 更新 query string
  const setSearchParamsFromKeys = useCallback((objectParams: Record<string, string | number>) => {
    const hasSearchParams = !!Array.from(searchParams.values()).length;
    let hasChanged = false;

    // 遍历新值，仅当某个 key 的值和当前 query 不同时才写入
    Object.entries(objectParams).forEach(([key, value]) => {
      if (searchParams.get(key) !== `${value}`) {
        searchParams.set(key, `${value}`);
        hasChanged = true;
      }
    });

    // 没有变化直接返回
    if (!hasChanged) return;

    if (hasSearchParams) {
      // 有 query 时调用 setSearchParams
      setSearchParams(searchParams);
    } else {
      // 无 query 时调用 navigate
      navigate(`?${searchParams.toString()}`, { replace: true });
    }
  }, [searchParams, navigate]);

  return {
    setSearchParamsFromKeys
  };
};

export default useSearchParamsFromObject;
