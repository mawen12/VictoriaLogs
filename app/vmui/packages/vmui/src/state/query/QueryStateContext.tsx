import { createContext, FC, useContext, useMemo, useReducer, Dispatch } from "preact/compat";
import { QueryAction, QueryState, initialQueryState, reducer } from "./reducer";

// 定义上下文类型，包含状态和分发函数
type QueryStateContextType = { state: QueryState, dispatch: Dispatch<QueryAction> };

// 创建上下文，提供状态和分发函数
export const QueryStateContext = createContext<QueryStateContextType>({} as QueryStateContextType);

// 导出自定义 Hook，方便组件获取状态和分发函数
export const useQueryState = (): QueryState => useContext(QueryStateContext).state;
// 导出自定义 Hook，方便组件获取分发函数
export const useQueryDispatch = (): Dispatch<QueryAction> => useContext(QueryStateContext).dispatch;

export const QueryStateProvider: FC = ({ children }) => {
  // 使用 useReducer 管理状态，并初始化为初始查询状态
  const [state, dispatch] = useReducer(reducer, initialQueryState);

  // 缓存状态值和分发函数，避免不必要的重新渲染
  const contextValue = useMemo(() => {
    return { state, dispatch };
  }, [state, dispatch]);

  // 提供状态和分发函数给子组件
  return <QueryStateContext.Provider value={contextValue}>
    {children}
  </QueryStateContext.Provider>;
};


