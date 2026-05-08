import { useRef } from "preact/compat";
import uPlot from "uplot";
import { SetMinMax } from "../../types";

interface DragHookArgs {
  dragSpeed: number,
  setPanning: (enable: boolean) => void,
  setPlotScale: SetMinMax
}

interface DragArgs {
  e: MouseEvent | TouchEvent,
  u: uPlot,
}

const isMouseEvent = (e: MouseEvent | TouchEvent): e is MouseEvent => e instanceof MouseEvent;
const getClientX = (e: MouseEvent | TouchEvent) => isMouseEvent(e) ? e.clientX : e.touches[0].clientX;

/**
 * 面向 uPlot 的高性能横向拖拽平移的 hook
 * 
 * @param dragSpeed 拖拽速度 
 * @param setPanning
 * @param setPlotScale
 * @returns 
 */
const useDragChart = ({ dragSpeed = 0.85, setPanning, setPlotScale }: DragHookArgs) => {
  // 存储推拽过程数据，避免 mousemove 高频触发导致重渲染
  const dragState = useRef({
    leftStart: 0,
    xUnitsPerPx: 0,
    scXMin: 0,
    scXMax: 0,
  });

  const mouseMove = (e: MouseEvent | TouchEvent) => {
    e.preventDefault();
    const clientX = getClientX(e);
    const { leftStart, xUnitsPerPx, scXMin, scXMax } = dragState.current;
    // 拖拽移动时根据位移计算 dx
    const dx = xUnitsPerPx * ((clientX - leftStart) * dragSpeed);
    // 实时调用以便更新范围，完成平移 
    setPlotScale({ min: scXMin - dx, max: scXMax - dx });
  };

  // 拖拽结束时关闭 panning 状态，并移除 document 级事件监听
  const mouseUp = () => {
    setPanning(false);
    document.removeEventListener("mousemove", mouseMove);
    document.removeEventListener("mouseup", mouseUp);
    document.removeEventListener("touchmove", mouseMove);
    document.removeEventListener("touchend", mouseUp);
  };

  // 同时支持鼠标和触摸事件（mouseEvent|touchEvent）
  // 监听绑定在 document 上，保证指针移出图标区域后仍能持续拖拽
  const mouseDown = () => {
    document.addEventListener("mousemove", mouseMove);
    document.addEventListener("mouseup", mouseUp);
    document.addEventListener("touchmove", mouseMove);
    document.addEventListener("touchend", mouseUp);
  };

  // 返回拖拽开始处理函数，在 mousedown/touchstart 时调用
  return ({ e, u }: DragArgs): void => {
    e.preventDefault();
    setPanning(true);

    // 拖拽开始时记录到 dragState
    dragState.current = {
      // 起始指针位置 leftStart
      leftStart: getClientX(e),
      // 像素到 x 轴数据的换算比例
      xUnitsPerPx: u.posToVal(1, "x") - u.posToVal(0, "x"),
      // 拖拽开始时的 x 轴范围
      scXMin: u.scales.x.min || 0,
      scXMax: u.scales.x.max || 0,
    };

    mouseDown();
  };
};

export default useDragChart;
