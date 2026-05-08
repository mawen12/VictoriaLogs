import { useState } from "preact/compat";
import uPlot from "uplot";
import useDragChart from "./useDragChart";
import { SetMinMax } from "../../types";

const isLiftClickWithMeta = (e: MouseEvent) => {
  const { ctrlKey, metaKey, button } = e;
  const leftClick = button === 0;
  return leftClick && (ctrlKey || metaKey);
};

// coefficient for drag speed; the higher the value, the faster the graph moves.
const dragSpeed = 0.9;

/**
 * uPlot 交互接入层 hook，负责把受控条件下的拖拽平移+光标锚点滚轮缩放转换为同一的 setPlotScale 更新
 * 
 * @param setPlotScale 
 * @returns 
 */
const useReadyChart = (setPlotScale: SetMinMax) => {
  // 维护图表是否处于拖拽状态
  const [isPanning, setPanning] = useState(false);

  // 使用 useDragChart 作为平移实现
  const dragChart = useDragChart({ dragSpeed, setPanning, setPlotScale });

  // 回调，供图标 ready 时注册交互事件
  const onReadyChart = (u: uPlot): void => {
    // 拖拽开始触发的函数
    const handleInteractionStart = (e: MouseEvent | TouchEvent) => {
      // 鼠标：左键 + Ctrl/Meta
      const dragByMouse = e instanceof MouseEvent && isLiftClickWithMeta(e);
      // 触摸：多指触控
      const dragByTouch = window.TouchEvent && e instanceof TouchEvent && e.touches.length > 1;
      // 满足条件后，调用 dragChart 开始平移
      if (dragByMouse || dragByTouch) {
        dragChart({ u, e });
      }
    };

    // 缩放
    const handleWheel = (e: WheelEvent) => {
      // 只响应 Ctrl + 滚轮
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      const { width } = u.over.getBoundingClientRect();
      const zoomPos = u.cursor.left && u.cursor.left > 0 ? u.cursor.left : 0;
      // 以当前光标所在 x 值作为缩放锚点
      const xVal = u.posToVal(zoomPos, "x");

      // 旧范围
      const oxRange = (u.scales.x.max || 0) - (u.scales.x.min || 0);
      // 通过旧范围和拖拽速度计算出新范围
      const nxRange = e.deltaY < 0 ? oxRange * dragSpeed : oxRange / dragSpeed;
      // 计算 min/max
      const min = xVal - (zoomPos / width) * nxRange;
      const max = min + nxRange;

      // 批量更新，将交互结果回传给时间范围/坐标范围状态
      u.batch(() => setPlotScale({ min, max }));
    };

    u.over.addEventListener("mousedown", handleInteractionStart);
    u.over.addEventListener("touchstart", handleInteractionStart);
    u.over.addEventListener("wheel", handleWheel);
  };

  return {
    onReadyChart,
    isPanning,
  };
};

export default useReadyChart;
