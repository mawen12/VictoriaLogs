import { createContext, FC, useContext, useMemo, useReducer, Dispatch } from "preact/compat";
import { LogsAction, LogsState, initialLogsState, reducer } from "./reducer";

// 定义上下文类型，包含状态和分发函数
type LogsStateContextType = { state: LogsState, dispatch: Dispatch<LogsAction> };

// 创建上下文，提供状态和分发函数
export const LogsStateContext = createContext<LogsStateContextType>({} as LogsStateContextType);

// 导出自定义 Hook，方便组件获取状态和分发函数
export const useLogsState = (): LogsState => useContext(LogsStateContext).state;
// 导出自定义 Hook，方便组件获取分发函数
export const useLogsDispatch = (): Dispatch<LogsAction> => useContext(LogsStateContext).dispatch;

export const LogsStateProvider: FC = ({ children }) => {
  // 使用 useReducer 管理状态，并初始化为初始日志状态
  const [state, dispatch] = useReducer(reducer, initialLogsState);

  // 缓存状态值和分发函数，避免不必要的重新渲染
  const contextValue = useMemo(() => {
    return { state, dispatch };
  }, [state, dispatch]);

  return <LogsStateContext.Provider value={contextValue}>
    {children}
  </LogsStateContext.Provider>;
};


