import { getFromStorage, saveToStorage } from "../../utils/storage";
import { getQueryArray } from "../../utils/query-string";
import { HistoryKey, setQueriesToStorage } from "../../components/QueryHistory/utils";
import {
  QueryAutocompleteCache,
  QueryAutocompleteCacheItem
} from "../../components/Configurators/QueryEditor/QueryAutocompleteCache";
import { AutocompleteOptions } from "../../components/Main/Autocomplete/Autocomplete";
import { getOverrideValue } from "../../components/Configurators/GlobalSettings/QueryTimeOverride/QueryTimeOverride";

export interface QueryHistoryType {
  index: number;
  values: string[];
}

// 查询状态
export interface QueryState {
  // 多个查询语句
  query: string[];
  // 查询历史记录
  queryHistory: QueryHistoryType[];
  // 是否启用自动补全
  autocomplete: boolean;
  // 是否启用快速自动补全模式
  autocompleteQuick: boolean;
  // 自动补全缓存，存储之前的自动补全结果，避免重复计算
  autocompleteCache: QueryAutocompleteCache;
  // MetricsQL 函数列表，用于自动补全提示
  metricsQLFunctions: AutocompleteOptions[];
  // 查询是否包含时间过滤器，用于提示用户可能需要调整时间范围
  queryHasTimeFilter: boolean;
}

// 更新值的操作以及值类型，对应 QueryState 中的字段
export type QueryAction =
  | { type: "SET_QUERY", payload: string[] }
  | { type: "SET_QUERY_HISTORY_BY_INDEX", payload: { value: QueryHistoryType, queryNumber: number } }
  | { type: "SET_QUERY_HISTORY", payload: { key: HistoryKey, history: QueryHistoryType[] } }
  | { type: "TOGGLE_AUTOCOMPLETE" }
  | { type: "SET_AUTOCOMPLETE_QUICK", payload: boolean }
  | { type: "SET_AUTOCOMPLETE_CACHE", payload: { key: QueryAutocompleteCacheItem, value: string[] } }
  | { type: "SET_QUERY_HAS_TIME_FILTER", payload: boolean }

const query = getQueryArray();
export const initialQueryState: QueryState = {
  query,
  queryHistory: query.map(q => ({ index: 0, values: [q] })),
  autocomplete: getFromStorage("AUTOCOMPLETE") as boolean || false,
  autocompleteQuick: false,
  autocompleteCache: new QueryAutocompleteCache(),
  metricsQLFunctions: [],
  queryHasTimeFilter: false,
};

export function reducer(state: QueryState, action: QueryAction): QueryState {
  switch (action.type) {
    case "SET_QUERY":
      return {
        ...state,
        query: action.payload.map(q => q)
      };
    case "SET_QUERY_HISTORY":
      setQueriesToStorage(action.payload.key, action.payload.history);
      return {
        ...state,
        queryHistory: action.payload.history
      };
    case "SET_QUERY_HISTORY_BY_INDEX":
      state.queryHistory.splice(action.payload.queryNumber, 1, action.payload.value);
      return {
        ...state,
        queryHistory: state.queryHistory
      };
    case "TOGGLE_AUTOCOMPLETE":
      saveToStorage("AUTOCOMPLETE", !state.autocomplete);
      return {
        ...state,
        autocomplete: !state.autocomplete
      };
    case "SET_AUTOCOMPLETE_QUICK":
      return {
        ...state,
        autocompleteQuick: action.payload
      };
    case "SET_AUTOCOMPLETE_CACHE": {
      state.autocompleteCache.put(action.payload.key, action.payload.value);
      return {
        ...state
      };
    }
    case "SET_QUERY_HAS_TIME_FILTER":
      return {
        ...state,
        queryHasTimeFilter: getOverrideValue() ? action.payload : false
      };
    default:
      throw new Error();
  }
}
