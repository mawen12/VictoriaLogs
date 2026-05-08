import { useAppState } from "../state/common/StateContext";
import { useEffect, useState } from "preact/compat";
import { getBuildInfoUrl } from "../api/buildinfo";

/**
 * 根据当期后端地址拉去版本信息，并把版本号暴露出去
 * 
 * @returns 
 */
const useGetVersion = () => {
  // 读取 AppState.serverUrl
  const { serverUrl } = useAppState();

  // version 状态
  const [version, setVersion] = useState("");

  // 在首次渲染和 serverUrl 变化时请求 build info 接口
  useEffect(() => {
    const fetchVersion = async () => {
      try {
        // 请求 version 接口
        const response = await fetch(getBuildInfoUrl(serverUrl));
        // 解析 JSON
        const result = await response.json();
        // 更新
        setVersion(result?.data?.version);
      } catch (e) {
        console.error(e);
      }
    };

    fetchVersion();
  }, [serverUrl]);

  return { version };
};

export default useGetVersion;

