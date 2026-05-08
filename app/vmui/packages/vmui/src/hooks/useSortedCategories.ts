import { useMemo } from "preact/compat";
import { MetricBase } from "../api/types";

export type MetricCategory = {
  key: string;
  variations: number;
}

export const getColumns = (data: MetricBase[]): MetricCategory[] => {
  const columns: { [key: string]: { options: Set<string> } } = {};
  data.forEach(d =>
    Object.entries(d.metric).forEach(e =>
      columns[e[0]] ? columns[e[0]].options.add(e[1]) : columns[e[0]] = { options: new Set([e[1]]) }
    )
  );

  return Object.entries(columns).map(e => ({
    key: e[0],
    variations: e[1].options.size
  })).sort((a1, a2) => a1.variations - a2.variations);
};

/**
 * 做维度列的统计排序+按展示白名单过滤 的 hook
 * 
 * @param data 
 * @param displayColumns 
 * @returns 
 */
export const useSortedCategories = (data: MetricBase[], displayColumns?: string[]): MetricCategory[] => (
  // 使用 useMemo 缓存结果，仅当 data/displayColumns 变化时才会重新计算
  useMemo(() => {
    if (!displayColumns) return [];
    // 获取每个 metric key 去重取值的数量
    const sortedColumns = getColumns(data);
    // 只保留 displayColumns 允许展示的列
    return sortedColumns.filter(col => displayColumns.includes(col.key));
  }, [data, displayColumns])
);
