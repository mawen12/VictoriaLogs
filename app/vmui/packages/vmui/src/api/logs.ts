// 请求 logs 的 url
export const getLogsUrl = (server: string): string =>
  `${server}/select/logsql/query`;

// 请求 hits 的 url
export const getLogHitsUrl = (server: string): string =>
  `${server}/select/logsql/hits`;

// 请求 stats query 的 url
export const getStatsQueryRangeUrl = (server: string): string =>
  `${server}/select/logsql/stats_query_range`;
