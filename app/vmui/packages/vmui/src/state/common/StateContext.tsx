import { createContext, FC, useContext, useMemo, useReducer, Dispatch } from "preact/compat";
import { Action, AppState, initialState, reducer } from "./reducer";
import { getQueryStringValue } from "../../utils/query-string";

// 定义上下文类型，包含状态和分发函数
type StateContextType = { state: AppState, dispatch: Dispatch<Action> };

// 创建上下文，提供状态和分发函数
export const StateContext = createContext<StateContextType>({} as StateContextType);

// 导出自定义 Hook，方便组件获取状态和分发函数
export const useAppState = (): AppState => useContext(StateContext).state;
// 导出自定义 Hook，方便组件获取分发函数
export const useAppDispatch = (): Dispatch<Action> => useContext(StateContext).dispatch;

export const initialPrepopulatedState = Object.entries(initialState)
  .reduce((acc, [key, value]) => ({
    ...acc,
    // 使用查询字符串中的值初始化状态，如果没有则使用默认值
    [key]: getQueryStringValue(key) || value
  }), {}) as AppState;

export const AppStateProvider: FC = ({ children }) => {
  // 使用 useReducer 管理状态，并初始化为预填充状态
  // useReducer 是用来替代 useState 的，适用于状态逻辑复杂或者包含多个子值的情况
  const [state, dispatch] = useReducer(reducer, initialPrepopulatedState);

  // 缓存状态值和分发函数，避免不必要的重新渲染
  const contextValue = useMemo(() => {
    return { state, dispatch };
  }, [state, dispatch]);

  // 提供状态和分发函数给子组件
  return <StateContext.Provider value={contextValue}>
    {children}
  </StateContext.Provider>;
};


