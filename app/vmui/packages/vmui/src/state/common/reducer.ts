import { getDefaultServer } from "../../utils/default-server-url";
import { getFromStorage, saveToStorage } from "../../utils/storage";
import { AppConfig, Theme } from "../../types";
import { isDarkTheme } from "../../utils/theme";
import { removeTrailingSlash } from "../../utils/url";

export interface AppState {
  // 服务端 URL 
  serverUrl: string;
  // 主题
  theme: Theme;
  // 是否为暗色主题
  isDarkTheme: boolean | null;
  // 标志位
  flags: Record<string, string | null>;
  // 应用配置
  appConfig: AppConfig
}

// 更新值的操作以及值类型，对应 AppState 中的字段
export type Action =
  | { type: "SET_SERVER", payload: string }
  | { type: "SET_THEME", payload: Theme }
  | { type: "SET_FLAGS", payload: Record<string, string | null> }
  | { type: "SET_APP_CONFIG", payload: AppConfig }
  | { type: "SET_DARK_THEME" }

// 初始默认值
export const initialState: AppState = {
  serverUrl: removeTrailingSlash(getDefaultServer()),
  theme: (getFromStorage("THEME") || Theme.system) as Theme,
  isDarkTheme: null,
  flags: {},
  appConfig: {}
};

export function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "SET_SERVER":
      return {
        ...state,
        serverUrl: removeTrailingSlash(action.payload)
      };
    case "SET_THEME":
      saveToStorage("THEME", action.payload);
      return {
        ...state,
        theme: action.payload,
      };
    case "SET_DARK_THEME":
      return {
        ...state,
        isDarkTheme: isDarkTheme(state.theme)
      };
    case "SET_FLAGS":
      return {
        ...state,
        flags: action.payload
      };
    case "SET_APP_CONFIG":
      return {
        ...state,
        appConfig: action.payload
      };
    default:
      throw new Error();
  }
}
