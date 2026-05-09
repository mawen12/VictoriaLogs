import { useMemo, useState } from "preact/compat";
import { getAxes, getMinMaxBuffer, handleDestroy, setSelect } from "../../../../utils/uplot";
import uPlot, { AlignedData, Band, Options, Series } from "uplot";
import { getCssVariable } from "../../../../utils/theme";
import { useAppState } from "../../../../state/common/StateContext";
import { MinMax, SetMinMax } from "../../../../types";
import { LogHits } from "../../../../api/types";
import { GraphOptions, GRAPH_STYLES } from "../types";
import { getColorFromString } from "../../../../utils/color";
import useBarPaths from "./useBarPaths";
import useBarClickHooks from "./useBarClickHooks";
import { Size } from "../../../../hooks/useResizeObserver";

const seriesColors = [
  "color-log-hits-bar-1",
  "color-log-hits-bar-2",
  "color-log-hits-bar-3",
  "color-log-hits-bar-4",
  "color-log-hits-bar-5",
];

const strokeWidth = {
  [GRAPH_STYLES.BAR]: 1,
  [GRAPH_STYLES.LINE_STEPPED]: 2,
  [GRAPH_STYLES.LINE]: 1.2,
  [GRAPH_STYLES.POINTS]: 0,
};

interface UseGetBarHitsOptionsArgs {
  data: AlignedData;
  logHits: LogHits[];
  xRange: MinMax;
  bands?: Band[];
  containerSize: Size;
  setPlotScale: SetMinMax;
  onReadyChart: (u: uPlot) => void;
  graphOptions: GraphOptions;
  timezone: string;
  setPeriod: (period: { from: Date, to: Date }) => void;
}

export const OTHER_HITS_LABEL = "other fields";

/**
 * 从 logHit 提取 label
 * 
 * @param logHit 
 * @returns 
 */
export const getLabelFromLogHit = (logHit: LogHits) => {
  if (logHit?._isOther) return OTHER_HITS_LABEL;
  // 提取字段值
  const fields = Object.values(logHit?.fields || {});
  // 使用逗号拼接值
  return fields.map((value) => value || "\"\"").join(", ");
};

const getYRange = (u: uPlot, initMin = 0, initMax = 1) => {
  const ySeries = u.series.filter(({ scale }) => scale === "y");

  let min = Infinity;
  let max = -Infinity;

  for (const s of ySeries) {
    const sMin = Number.isFinite(s.min) ? (s.min as number) : initMin;
    const sMax = Number.isFinite(s.max) ? (s.max as number) : initMax;

    if (sMin < min) min = sMin;
    if (sMax > max) max = sMax;
  }

  let lo = Number.isFinite(min) ? min : initMin;
  let hi = Number.isFinite(max) ? max : initMax;

  // If the whole dataset is non-negative, anchor the lower bound at 0
  if (lo >= 0) lo = 0;

  // If the whole dataset is non-positive, anchor the upper bound at 0
  if (hi <= 0) hi = 0;

  return getMinMaxBuffer(lo, hi);
};

/**
 * 
 * 
 * @param param0 
 * @returns 
 */
const useBarHitsOptions = ({
  data,
  logHits,
  xRange,
  bands,
  containerSize,
  onReadyChart,
  setPlotScale,
  graphOptions,
  timezone,
  setPeriod,
}: UseGetBarHitsOptionsArgs) => {
  const { isDarkTheme } = useAppState();
  const { barPaths, drawHoverBar, getHoverAbsIdxForBars } = useBarPaths();
  const barClickHooks = useBarClickHooks({
    getHoverAbsIdxForBars,
    onBarClick: setPeriod,
  });

  const [focusDataIdx, setFocusDataIdx] = useState(-1);

  const setCursor = (u: uPlot) => {
    const nextIdx = getHoverAbsIdxForBars(u);
    setFocusDataIdx((prev) => (prev === nextIdx ? prev : nextIdx));
    requestAnimationFrame(() => u.redraw());
  };

  //
  const series: Series[] = useMemo(() => {
    let visibleColorIndex = 0;

    return data.map((_d, i) => {
      // 第 0 条是 x 轴，直接返回 {}
      if (i === 0) return {}; // x-axis

      // 修改偏移位置，从 1 对其 0，读取命中数量
      const logHit = logHits?.[i - 1];
      // 从 logHit 提取 label
      const label = getLabelFromLogHit(logHit);
      const isOther = logHit?._isOther;
      // 决定 series 的颜色
      const colorVar = isOther
        ? "color-log-hits-bar-0"
        : seriesColors[visibleColorIndex];

      const color = visibleColorIndex >= 5 ? getColorFromString(label) : getCssVariable(colorVar);

      if (!isOther) visibleColorIndex += 1;

      return {
        // 序列名称
        label,
        // 序列宽度
        width: strokeWidth[graphOptions.graphStyle],
        // 当数据中有 null 时，把前后端连接起来
        spanGaps: true,
        // 展示该序列
        show: true,
        // 线条颜色
        stroke: color,
        // 填充颜色
        fill: graphOptions.fill && !isOther ? `${color}80` : graphOptions.fill ? color : "",
        // 序列的绘制路径
        paths: barPaths,
        // 不是点样式
        points: { show: false },
      };
    });
  }, [isDarkTheme, data, graphOptions, logHits, barPaths]);

  const options: Options = {
    // 定义数据序列的显示
    series,
    // 区域，定义两个 series 之间的填充带
    bands,
    // 图标尺寸：宽度，默认视口的一半
    width: containerSize.width || (window.innerWidth / 2),
    // 图标尺寸：高度，默认200高度
    height: containerSize.height || 200,
    // 鼠标悬停、十字线、联动等交互配置
    cursor: {
      points: { width: 0, size: 0 },
    },
    // 定义坐标缩放规则
    scales: {
      // x 轴为时间轴
      x: {
        time: true,
        range: () => [xRange.min, xRange.max]
      },
      y: {
        range: getYRange
      }
    },
    // 回调函数
    hooks: {
      drawSeries: [],

      draw: [drawHoverBar],

      ready: [onReadyChart, barClickHooks.ready],

      setCursor: [setCursor],

      setSelect: [setSelect(setPlotScale)],

      destroy: [handleDestroy, barClickHooks.destroy],
    },
    // 是否展示 series 的名字和值
    legend: { show: false },
    // 定义坐标轴怎么显示
    axes: getAxes([{}, { scale: "y" }]),
    tzDate: ts => uPlot.tzDate(new Date(Math.round(ts * 1000)), timezone),
  };

  return {
    options,
    series,
    focusDataIdx,
  };
};

export default useBarHitsOptions;
