import { TimeParams, TimePeriod } from "../../types";
import {
  dateFromSeconds,
  formatDateToLocal,
  getDateNowUTC,
  getDurationFromPeriod,
  getTimeperiodForDuration,
  getRelativeTime,
  setTimezone,
  getBrowserTimezone
} from "../../utils/time";
import { getQueryStringValue } from "../../utils/query-string";
import { getFromStorage, saveToStorage } from "../../utils/storage";

export interface TimeState {
  // 持续时间
  duration: string;
  // 时间范围
  period: TimeParams;
  // 相对时间
  relativeTime?: string;
  // 时区
  timezone: string;
  // 默认时区
  defaultTimezone?: string;
}

// 更新值的操作以及值类型，对应 TimeState 中的字段
export type TimeAction =
  | { type: "SET_TIME_STATE", payload: { duration: string, period: TimeParams, relativeTime?: string; } }
  | { type: "SET_DURATION", payload: string }
  | { type: "SET_RELATIVE_TIME", payload: {id: string, duration: string, until: Date} }
  | { type: "SET_PERIOD", payload: TimePeriod }
  | { type: "RUN_QUERY"}
  | { type: "RUN_QUERY_TO_NOW"}
  | { type: "SET_TIMEZONE", payload: string }
  | { type: "SET_DEFAULT_TIMEZONE", payload: string }

// 从存储中获取默认时区，如果没有则使用浏览器时区
const timezone = getFromStorage("TIMEZONE") as string || getBrowserTimezone().region;
setTimezone(timezone);

// 获取初始时间状态，优先使用查询字符串中的值，如果没有则使用默认值
export const getInitialTimeState = () => {
  const defaultDuration = getQueryStringValue("g0.range_input") as string;

  const { duration, endInput, relativeTimeId } = getRelativeTime({
    defaultDuration: defaultDuration || "1h",
    defaultEndInput: formatDateToLocal(getQueryStringValue("g0.end_input", getDateNowUTC()) as string),
    relativeTimeId: defaultDuration ? getQueryStringValue("g0.relative_time", "none") as string : undefined
  });

  return {
    duration,
    period: getTimeperiodForDuration(duration, endInput),
    relativeTime: relativeTimeId,
  };
};

export const initialTimeState: TimeState = {
  ...getInitialTimeState(),
  timezone,
};


export function reducer(state: TimeState, action: TimeAction): TimeState {
  switch (action.type) {
    case "SET_TIME_STATE":
      return {
        ...state,
        ...action.payload
      };
    case "SET_DURATION":
      return {
        ...state,
        duration: action.payload,
        period: getTimeperiodForDuration(action.payload, dateFromSeconds(state.period.end)),
        relativeTime: "none"
      };
    case "SET_RELATIVE_TIME":
      return {
        ...state,
        duration: action.payload.duration,
        period: getTimeperiodForDuration(action.payload.duration, action.payload.until),
        relativeTime: action.payload.id,
      };
    case "SET_PERIOD":
      // eslint-disable-next-line no-case-declarations
      const durationPeriod = getDurationFromPeriod(action.payload);
      return {
        ...state,
        duration: durationPeriod,
        period: getTimeperiodForDuration(durationPeriod, action.payload.to),
        relativeTime: "none"
      };
    case "RUN_QUERY":
      // eslint-disable-next-line no-case-declarations
      const { duration: durationRunQuery, endInput } = getRelativeTime({
        relativeTimeId: state.relativeTime,
        defaultDuration: state.duration,
        defaultEndInput: dateFromSeconds(state.period.end),
      });
      return {
        ...state,
        period: getTimeperiodForDuration(durationRunQuery, endInput)
      };
    case "RUN_QUERY_TO_NOW":
      return {
        ...state,
        period: getTimeperiodForDuration(state.duration)
      };
    case "SET_TIMEZONE":
      setTimezone(action.payload);
      saveToStorage("TIMEZONE", action.payload);
      if (state.defaultTimezone) saveToStorage("DISABLED_DEFAULT_TIMEZONE", action.payload !== state.defaultTimezone);
      return {
        ...state,
        timezone: action.payload
      };
    case "SET_DEFAULT_TIMEZONE":
      return {
        ...state,
        defaultTimezone: action.payload
      };
    default:
      throw new Error();
  }
}
