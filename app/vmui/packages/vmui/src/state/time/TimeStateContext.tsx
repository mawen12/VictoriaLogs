import { createContext, FC, useContext, useMemo, useReducer, Dispatch } from "preact/compat";
import { TimeAction, TimeState, initialTimeState, reducer } from "./reducer";

// 定义上下文类型，包含状态和分发函数
type TimeStateContextType = { state: TimeState, dispatch: Dispatch<TimeAction> };

// 创建上下文，提供状态和分发函数
export const TimeStateContext = createContext<TimeStateContextType>({} as TimeStateContextType);

// 导出自定义 Hook，方便组件获取状态和分发函数
export const useTimeState = (): TimeState => useContext(TimeStateContext).state;
// 导出自定义 Hook，方便组件获取分发函数
export const useTimeDispatch = (): Dispatch<TimeAction> => useContext(TimeStateContext).dispatch;

export const TimeStateProvider: FC = ({ children }) => {
  // 使用 useReducer 管理状态，并初始化为初始时间状态
  // useReducer 是用来替代 useState 的，适用于状态逻辑复杂或者包含多个子值的情况
  const [state, dispatch] = useReducer(reducer, initialTimeState);

  // 缓存状态值和分发函数，避免不必要的重新渲染
  const contextValue = useMemo(() => {
    return { state, dispatch };
  }, [state, dispatch]);

  // 提供状态和分发函数给子组件
  return <TimeStateContext.Provider value={contextValue}>
    {children}
  </TimeStateContext.Provider>;
};


