import { useCallback, useState } from "preact/compat";
import useEventListener from "../useEventListener";
import { MinMax, SetMinMax } from "../../types";

interface ZoomChartHook {
  uPlotInst?: uPlot;
  xRange: MinMax;
  setPlotScale: SetMinMax;
}

const calculateDistance = (touches: TouchList) => {
  const dx = touches[0].clientX - touches[1].clientX;
  const dy = touches[0].clientY - touches[1].clientY;
  return Math.sqrt(dx * dx + dy * dy);
};

/**
 * 图标缩放交互控制器 hook
 * 
 * @param param0 
 * @returns 
 */
const useZoomChart = ({ uPlotInst, xRange, setPlotScale }: ZoomChartHook) => {
  // 维护一个起始双指距离，用于计算捏合方向和幅度
  const [startTouchDistance, setStartTouchDistance] = useState(0);

  // 监听 keydown：按 + 或 - 时调整当前 xRange
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const { target, ctrlKey, metaKey, key } = e;
    const isInput = target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement;
    if (!uPlotInst || isInput) return;

    const isPlus = key === "+" || key === "=";
    const isMinus = key === "-";
    const isNotControlKey = !(ctrlKey || metaKey);

    if ((isMinus || isPlus) && isNotControlKey) {
      e.preventDefault();
      // 每次按键按当前区间的 10% 进行缩放步进
      const factor = (xRange.max - xRange.min) / 10 * (isPlus ? 1 : -1);
      // 通过 setPlotScale 更新图标 x 轴范围
      setPlotScale({ min: xRange.min + factor, max: xRange.max - factor });
    }
  }, [uPlotInst, xRange]);

  // 监听 touchstart：双指开始时记录初始距离
  const handleTouchStart = (e: TouchEvent) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      setStartTouchDistance(calculateDistance(e.touches));
    }
  };

  // 监听 touchmove：双指移动时计算距离变化，按方向缩放区间
  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!uPlotInst || e.touches.length !== 2) return;
    e.preventDefault();

    // 双指捏合根据两次触点距离差决定放大或缩小
    const endTouchDistance = calculateDistance(e.touches);
    const diffDistance = startTouchDistance - endTouchDistance;

    const max = (uPlotInst.scales.x.max || xRange.max);
    const min = (uPlotInst.scales.x.min || xRange.min);
    const dur = max - min;
    const dir = (diffDistance > 0 ? -1 : 1);

    const zoomFactor = dur / 50 * dir;
    // 使用 batch 包裹更新，通过 setPlotScale 更新图标 x 轴范围，减少绘制抖动
    uPlotInst.batch(() => setPlotScale({ min: min + zoomFactor, max: max - zoomFactor }));
  }, [uPlotInst, startTouchDistance, xRange]);

  useEventListener("keydown", handleKeyDown);
  useEventListener("touchmove", handleTouchMove);
  useEventListener("touchstart", handleTouchStart);

  return null;
};

export default useZoomChart;
