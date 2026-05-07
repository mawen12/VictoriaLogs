import { createContext, FC, useContext, useMemo, useReducer, Dispatch } from "preact/compat";
import { Action, OverviewState, initialState, reducer } from "./reducer";
import { getQueryStringValue } from "../../utils/query-string";

// 定义上下文类型，包含状态和分发函数
type StateContextType = { state: OverviewState, dispatch: Dispatch<Action> };

// 创建上下文，提供状态和分发函数
export const OverviewStateContext = createContext<StateContextType>({} as StateContextType);

// 导出自定义 Hook，方便组件获取状态和分发函数
export const useOverviewState = (): OverviewState => useContext(OverviewStateContext).state;
// 导出自定义 Hook，方便组件获取分发函数
export const useOverviewDispatch = (): Dispatch<Action> => useContext(OverviewStateContext).dispatch;

export const initialPrepopulatedState = Object.entries(initialState)
  .reduce((acc, [key, value]) => ({
    ...acc,
    // 使用查询字符串中的值初始化状态，如果没有则使用默认值
    [key]: getQueryStringValue(key) || value
  }), {}) as OverviewState;

export const OverviewStateProvider: FC = ({ children }) => {
  // 使用 useReducer 管理状态，并初始化为预填充状态
  const [state, dispatch] = useReducer(reducer, initialPrepopulatedState);

  // 缓存状态值和分发函数，避免不必要的重新渲染
  const contextValue = useMemo(() => {
    return { state, dispatch };
  }, [state, dispatch]);

  return <OverviewStateContext.Provider value={contextValue}>
    {children}
  </OverviewStateContext.Provider>;
};


