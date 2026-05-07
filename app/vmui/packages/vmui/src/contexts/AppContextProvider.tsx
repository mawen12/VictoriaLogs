import { AppStateProvider } from "../state/common/StateContext";
import { TimeStateProvider } from "../state/time/TimeStateContext";
import { QueryStateProvider } from "../state/query/QueryStateContext";
import { LogsStateProvider } from "../state/logsPanel/LogsStateContext";
import { OverviewStateProvider } from "../state/overview/OverviewStateContext";
import { SnackbarProvider } from "./Snackbar";

import { combineComponents } from "../utils/combine-components";

const providers = [
  // 应用状态
  AppStateProvider,
  // 时间状态
  TimeStateProvider,
  // 查询状态
  QueryStateProvider,
  // 提示状态，展示全局提示信息
  SnackbarProvider,
  // 日志状态
  LogsStateProvider,
  // 概览状态
  OverviewStateProvider,
];

export default combineComponents(...providers);
