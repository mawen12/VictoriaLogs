import { MinMax } from "../../types";
import { limitsDurations } from "../../utils/time";
import { useEffect, useState } from "preact/compat";
import { TimeParams } from "../../types";
import dayjs from "dayjs";

interface PlotScaleHook {
  setPeriod: ({ from, to }: { from: Date, to: Date }) => void;
  period: TimeParams;
}

/**
 * 把图表坐标范围安全地转换成查询时间区间，保持 UI 与全局时间状态同步 hook
 * 
 * 背景：
 *  1.图表内部通常使用秒级 min/max 范围
 *  2.业务查询通常使用 Date 类型的 from/to
 *  3.该 hook 负责把两者转换并保持同步，同时做时长边界保护
 * 
 * 场景：
 *  1.period 变化时，通过 useEffect 来同步更新 xRange
 *  2.xRange 变化时，通过暴露出去的 setPlotScale 函数来间接调用 setPeriod 实现同步
 * 
 * 
 * @param param0 
 * @returns 
 */
const usePlotScale = ({ period, setPeriod }: PlotScaleHook) => {
  // 保存当前图标范围
  const [xRange, setXRange] = useState({ min: period.start, max: period.end });

  const setPlotScale = ({ min, max }: MinMax) => {
    // 计算窗口时长（毫秒）
    const delta = (max - min) * 1000;
    // 当超出边界后返回
    if ((delta < limitsDurations.min) || (delta > limitsDurations.max)) return;

    // 合法时将秒级范围转换为 Date，并通过 setPeriod 进行状态回写
    setPeriod({
      from: dayjs(min * 1000).toDate(),
      to: dayjs(max * 1000).toDate()
    });
  };

  // 当外部 period 改变时，反向同步 xRange，确保图标显示和全局筛选一致
  useEffect(() => {
    setXRange({ min: period.start, max: period.end });
  }, [period]);

  return {
    xRange,
    setPlotScale
  };
};

export default usePlotScale;
