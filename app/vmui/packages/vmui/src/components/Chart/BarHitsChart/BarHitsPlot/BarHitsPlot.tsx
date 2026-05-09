import { FC, useEffect, useMemo, useRef, useState } from "preact/compat";
import uPlot, { AlignedData } from "uplot";
import { GraphOptions } from "../types";
import usePlotScale from "../../../../hooks/uplot/usePlotScale";
import useReadyChart from "../../../../hooks/uplot/useReadyChart";
import useZoomChart from "../../../../hooks/uplot/useZoomChart";
import stack from "../../../../utils/uplot/stack";
import useBarHitsOptions, { getLabelFromLogHit } from "../hooks/useBarHitsOptions";
import { LegendLogHits, LogHits } from "../../../../api/types";
import { addSeries, delSeries, setBand } from "../../../../utils/uplot";
import classNames from "classnames";
import BarHitsTooltip from "../BarHitsTooltip/BarHitsTooltip";
import { TimeParams } from "../../../../types";
import BarHitsLegend from "../BarHitsLegend/BarHitsLegend";
import { sortLogHits } from "../../../../utils/logs";
import { useAppState } from "../../../../state/common/StateContext";
import { useTimeState } from "../../../../state/time/TimeStateContext";
import useDeviceDetect from "../../../../hooks/useDeviceDetect";
import { cumulativeMatrix } from "../../../../utils/uplot/cumulative";
import { Size, useResizeObserver } from "../../../../hooks/useResizeObserver";

interface Props {
  logHits: LogHits[];
  totalHits: number;
  data: AlignedData;
  period: TimeParams;
  setPeriod: ({ from, to }: { from: Date, to: Date }) => void;
  graphOptions: GraphOptions;
}

/**
 * 柱状命中图组件
 * 
 * 把传入的日志聚合数据交给 uplot 渲染：
 * 
 * 数据缓存：
 * - 当支持 cumulative 时，缓存计算结果，避免每次开启时重新计算
 * - 当支持 stacked 时，缓存计算结果，避免每次开启时重新计算
 * 
 * 副作用：
 * - 当其挂载的 ref 可用/主题变化/时区变化时，初始化 uPlot 并维护该实例
 * - 当 series 变化时，同步到 uPlot 并重新渲染
 * - 当 brands 变化时，同步到 uPlot 并重新渲染
 * - 当 xRange 变化时，同步到 uPlot 并重新渲染
 * - 当 containerSize 变化时，同步到 uPlot 并重新渲染
 * - 当 data 变化时，，同步到 uPlot 并重新渲染 <- useResizeObserver
 * 
 * @param graphOptions 外部的图标配置 
 * @returns 
 */
const BarHitsPlot: FC<Props> = ({ graphOptions, logHits, totalHits, data: _data, period, setPeriod }: Props) => {
  const { isMobile } = useDeviceDetect();
  const { isDarkTheme } = useAppState();
  const { timezone } = useTimeState();
  const containerRef = useRef<HTMLDivElement>(null);

  // uPlot 挂载的 DOM
  const uPlotRef = useRef<HTMLDivElement>(null);
  // 维护 uPlot实例 状态
  const [uPlotInst, setUPlotInst] = useState<uPlot>();

  const [containerSize, setContainerSize] = useState<Size>({ width: 0, height: 0 });

  const { xRange, setPlotScale } = usePlotScale({ period, setPeriod });
  const { onReadyChart, isPanning } = useReadyChart(setPlotScale);
  useZoomChart({ uPlotInst, xRange, setPlotScale });

  // 当 cumulative 开启时，做累计矩阵转换
  const transformedData = useMemo(() => {
    if (graphOptions.cumulative) return cumulativeMatrix(_data);
    return _data;
  }, [graphOptions.cumulative, _data]);

  // 当 stacked 开启时，做堆叠并生成 brands
  const { data, bands } = useMemo(() => {
    if (graphOptions.stacked) return stack(transformedData, () => false);
    return { data: transformedData, bands: [] };
  }, [graphOptions.stacked, transformedData]);

  const { options, series, focusDataIdx } = useBarHitsOptions({
    data,
    logHits,
    bands,
    xRange,
    containerSize,
    onReadyChart,
    setPlotScale,
    graphOptions,
    timezone,
    setPeriod
  });

  const legendDetails: LegendLogHits[] = useMemo(() => {
    return logHits.map((hit) => {
      const label = getLabelFromLogHit(hit);

      const legendItem: LegendLogHits = {
        label,
        isOther: hit._isOther,
        fields: hit.fields,
        total: hit.total || 0,
        totalHits,
        stroke: series.find((s) => s.label === label)?.stroke,
      };

      return legendItem;
    }).sort(sortLogHits("total"));
  }, [logHits, totalHits, series]);

  const isSingleOtherSeries = useMemo(() => {
    return legendDetails.length === 1 && legendDetails.every(l => l.isOther);
  }, [legendDetails]);

  // 当线条发生变化时，同步到 uPlot 并重新渲染
  useEffect(() => {
    // 安全检查，仅在实例存在后才能操作
    if (!uPlotInst) return;

    // 保存旧线条
    const oldSeriesMap = new Map(uPlotInst.series.map(s => [s.label, s]));

    // 使用新线条，但保留 show 配置
    const syncedSeries = series.map(s => {
      const old = oldSeriesMap.get(s.label);
      return old ? { ...s, show: old.show } : s;
    });

    // 删除旧线条
    delSeries(uPlotInst);
    // 添加新线条
    addSeries(uPlotInst, syncedSeries, true);
    // 更新 brand
    setBand(uPlotInst, syncedSeries);
    // 同步绘制
    uPlotInst.redraw();
  }, [series, uPlotInst]);

  // 当两条线之间的填充区域发生变化时，同步到 uPlot 并重新渲染
  useEffect(() => {
    // 安全检查，仅在实例存在后才能操作
    if (!uPlotInst) return;
    // 清除旧 band
    uPlotInst.delBand();
    // 逐个添加新 band
    bands.forEach(band => {
      uPlotInst.addBand(band);
    });
    // 重新绘制
    uPlotInst.redraw();
  }, [bands]);

  // 在主题或时区变化时，初始化并维护 uPlot 实例
  useEffect(() => {
    // 如果没有指定 uPlot 挂载的 DOM，则退出
    // 也就是说在容器 ref 可用时创建实例
    if (!uPlotRef.current) return;
    // 初始化 uPlot 实例
    const uplot = new uPlot(options, data, uPlotRef.current);
    // 写入状态，维护实例
    setUPlotInst(uplot);
    // 组件销毁时，同步销毁 uPlot，避免资源泄漏
    return () => uplot.destroy();
  }, [uPlotRef.current, isDarkTheme, timezone]);

  // 当起止范围（x轴）发生变化时，同步到 uPlot 并重新渲染
  useEffect(() => {
    // 安全检查，仅在实例存在后才能操作
    if (!uPlotInst) return;
    // 同步更新
    uPlotInst.scales.x.range = () => [xRange.min, xRange.max];
    // 重新绘制
    uPlotInst.redraw();
  }, [xRange]);

  // 当外部容器大小发生变化时，同步到 uPlot 并重新渲染
  useEffect(() => {
    // 安全检查，仅在实例存在后才能操作
    if (!uPlotInst) return;
    // 同步更新
    uPlotInst.setSize({
      width: containerSize.width || window.innerWidth / 2,
      height: containerSize.height || window.innerHeight / 4,
    });
    // 重新绘制
    uPlotInst.redraw();
  }, [containerSize]);

  // 当展示数据发生变更时，同步到 uPlot 并重新渲染
  useEffect(() => {
    // 安全检查，仅在实例存在后才能操作
    if (!uPlotInst) return;
    // 同步更新
    uPlotInst.setData(data);
    // 重新绘制
    uPlotInst.redraw();
  }, [data]);

  // 当对页面对应调整时，触发对应操作
  useResizeObserver({ ref: containerRef, onResize: setContainerSize });

  return (
    <>
      <div
        className={classNames({
          "vm-bar-hits-chart": true,
          "vm-bar-hits-chart_panning": isPanning
        })}
        ref={containerRef}
      >
        <div
          className="vm-line-chart__u-plot"
          // uplot 挂载在该元素上
          ref={uPlotRef}
        />
        {/* 网页端实现 tooltip */}
        {!isMobile && (
          <BarHitsTooltip
            uPlotInst={uPlotInst}
            data={transformedData}
            focusDataIdx={focusDataIdx}
          />
        )}
      </div>

      {/* 展示 brand */}
      {uPlotInst && !isSingleOtherSeries && (
        <BarHitsLegend
          uPlotInst={uPlotInst}
          legendDetails={legendDetails}
        />
      )}
    </>
  );
};

export default BarHitsPlot;
