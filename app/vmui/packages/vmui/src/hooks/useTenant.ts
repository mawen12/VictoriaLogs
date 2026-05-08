import { useMemo } from "preact/compat";
import { useSearchParams } from "react-router-dom";

/**
 * URL 租户参数适配 hook
 * 
 * @returns 
 */
export const useTenant = () => {
  const [searchParams] = useSearchParams();

  // 从 query 参数提取 accountID/projectID
  const accountID = searchParams.get("accountID") || "0";
  const projectID = searchParams.get("projectID") || "0";

  // 缓存，仅当 accountID/projectID 变化时才创建新对象
  return useMemo(() => ({
    AccountID: accountID,
    ProjectID: projectID,
  }), [accountID, projectID]);
};
