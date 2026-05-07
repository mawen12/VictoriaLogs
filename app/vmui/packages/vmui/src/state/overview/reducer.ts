import { LogsFieldValues } from "../../api/types";

type ParamsKey = string;

export interface OverviewState {
  // 日志总数
  totalLogs: number;
  // 日志字段列表，用于查询自动补全
  fieldNames: LogsFieldValues[];
  // fieldNames 的参数键，用于缓存和查询字符串
  fieldNamesParamsKey: ParamsKey | null;
  // 流字段列表，用于查询自动补全
  streamsFieldNames: LogsFieldValues[];
  // streamsFieldNames 的参数键，用于缓存和查询字符串
  streamsFieldNamesParamsKey: ParamsKey | null;
}

// 更新值的操作以及值类型，对应 OverviewState 中的字段
export type Action =
  | { type: "SET_TOTAL_LOGS"; payload: number }
  | { type: "SET_FIELD_NAMES"; payload: { key: ParamsKey; rows: LogsFieldValues[] } }
  | { type: "SET_STREAM_FIELD_NAMES"; payload: { key: ParamsKey; rows: LogsFieldValues[] } }

export const initialState: OverviewState = {
  totalLogs: 0,
  fieldNames: [],
  fieldNamesParamsKey: null,
  streamsFieldNames: [],
  streamsFieldNamesParamsKey: null,
};

export function reducer(state: OverviewState, action: Action): OverviewState {
  switch (action.type) {
    case "SET_TOTAL_LOGS":
      return { ...state, totalLogs: action.payload };

    case "SET_FIELD_NAMES":
      return {
        ...state,
        fieldNames: action.payload.rows,
        fieldNamesParamsKey: action.payload.key,
      };

    case "SET_STREAM_FIELD_NAMES":
      return {
        ...state,
        streamsFieldNames: action.payload.rows,
        streamsFieldNamesParamsKey: action.payload.key,
      };

    default:
      throw new Error("Unknown action");
  }
}
