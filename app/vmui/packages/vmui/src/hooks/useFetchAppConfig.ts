import { useAppDispatch } from "../state/common/StateContext";
import { useEffect, useState } from "preact/compat";
import { ErrorTypes } from "../types";

/**
 * 在应用初始化时读取配置文件并写入全局状态，
 * 同时向页面保留加载态和错误
 * 
 * @returns 
 */
const useFetchFlags = () => {
  // AppState 更新器
  const dispatch = useAppDispatch();

  // 加载中的状态
  const [isLoading, setIsLoading] = useState(false);
  // 错误状态
  const [error, setError] = useState<ErrorTypes | string>("");

  // 仅首轮执行一次异步加载
  useEffect(() => {
    const fetchAppConfig = async () => {
      setError("");
      // TODO by mawen 此处没有把 isLoading 置为 false
      setIsLoading(true);

      try {
        // 读取 config.json 文件
        const data = await fetch("./config.json");
        // 解析 JSON
        const config = await data.json();
        // 更新到 AppState
        dispatch({ type: "SET_APP_CONFIG", payload: config || {} });
      } catch (e) {
        setIsLoading(false);
        if (e instanceof Error) setError(`${e.name}: ${e.message}`);
      }
    };

    // 仅触发一次，在组件挂载时
    fetchAppConfig();
  }, []);

  return { isLoading, error };
};

export default useFetchFlags;

