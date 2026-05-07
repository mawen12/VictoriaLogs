import { getFromStorage, saveToStorage } from "../../utils/storage";
import { LogsFieldValues } from "../../api/types";
import { AUTOCOMPLETE_LIMITS } from "../../constants/queryAutocomplete";

export interface LogsState {
  // 是否启用 Markdown 解析
  markdownParsing: boolean;
  // 是否启用 ANSI 解析
  ansiParsing: boolean;
  // 自动补全缓存，键为查询字段，值为该字段的可能取值列表
  autocompleteCache: Map<string, LogsFieldValues[]>;
}

// 更新值的操作以及值类型，对应 LogsState 中的字段
export type LogsAction =
  | { type: "SET_MARKDOWN_PARSING", payload: boolean }
  | { type: "SET_ANSI_PARSING", payload: boolean }
  | { type: "SET_AUTOCOMPLETE_CACHE", payload: { key: string, value: LogsFieldValues[] } }


export const initialLogsState: LogsState = {
  markdownParsing: getFromStorage("LOGS_MARKDOWN") === "true",
  ansiParsing: getFromStorage("LOGS_ANSI") === "true",
  autocompleteCache: new Map<string, LogsFieldValues[]>(),
};

export function reducer(state: LogsState, action: LogsAction): LogsState {
  switch (action.type) {
    case "SET_MARKDOWN_PARSING":
      saveToStorage("LOGS_MARKDOWN", `${ action.payload}`);
      return {
        ...state,
        markdownParsing: action.payload
      };
    case "SET_ANSI_PARSING":
      saveToStorage("LOGS_ANSI", `${ action.payload}`);
      return {
        ...state,
        ansiParsing: action.payload
      };
    case "SET_AUTOCOMPLETE_CACHE": {
      if (state.autocompleteCache.size >= AUTOCOMPLETE_LIMITS.cacheLimit) {
        const firstKey = state.autocompleteCache.keys().next().value;
        firstKey && state.autocompleteCache.delete(firstKey);
      }
      state.autocompleteCache.set(action.payload.key, action.payload.value);

      return {
        ...state,
        autocompleteCache: state.autocompleteCache,
      };
    }
    default:
      throw new Error();
  }
}
