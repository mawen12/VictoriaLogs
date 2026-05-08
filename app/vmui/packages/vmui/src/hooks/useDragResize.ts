import { useEffect, useRef, useState } from "preact/hooks";
import { RefObject } from "preact/compat";
import { borderBoxToContentSize } from "../utils/dom-geometry";

type Axis = "x" | "y";
type Direction = 1 | -1;

type Options = {
  targetRef: RefObject<HTMLElement>;
  minSize?: number;
  axis?: Axis;
  dir?: Direction;
  onResizeEnd: (sizePx: number) => void;
};

/**
 * 封装拖拽元素尺寸
 * 
 * @param targetRef 
 * @param minSize 最小尺寸
 * @param axis 横向或纵向拉伸
 * @param dir 正向/反向拖拽
 * @param onResizeEnd 拖拽结束时回调
 * @returns 
 */
export function useDragResize({
  targetRef,
  minSize = 80,
  axis = "x",
  dir = 1,
  onResizeEnd,
}: Options) {
  const [isResizing, setIsResizing] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);

  const startPosRef = useRef(0);
  const startSizeRef = useRef(0);
  const dragOffsetRef = useRef(0);

  const cleanupRef = useRef<null | (() => void)>(null);

  const getClientPos = (e: MouseEvent) => (axis === "x" ? e.clientX : e.clientY);

  const getCurrentSize = (el: HTMLElement) => {
    const rect = el.getBoundingClientRect();
    return axis === "x" ? rect.width : rect.height;
  };

  const onMouseDown = (mouseDownEvent: MouseEvent) => {
    cleanupRef.current?.();

    mouseDownEvent.preventDefault();
    mouseDownEvent.stopPropagation();

    const target = targetRef.current;
    if (!target) return;

    setIsResizing(true);
    setDragOffset(0);
    dragOffsetRef.current = 0;

    // 记录起点坐标
    startPosRef.current = getClientPos(mouseDownEvent);
    // 记录起始尺寸
    startSizeRef.current = getCurrentSize(target);

    // 用于持续计算偏移量，并更新 dragOffset
    const onMouseMove = (mouseMoveEvent: MouseEvent) => {
      const rawOffset = (getClientPos(mouseMoveEvent) - startPosRef.current) * dir;
      const minOffset = minSize - startSizeRef.current;
      // 下限保护，避免小于最小尺寸
      const nextOffset = Math.max(rawOffset, minOffset);

      dragOffsetRef.current = nextOffset;
      setDragOffset(nextOffset);
    };

    const onMouseUp = () => {
      const finalBorderBox = Math.max(minSize, startSizeRef.current + dragOffsetRef.current);
      // 计算最终尺寸
      const finalSize = borderBoxToContentSize(target, finalBorderBox, axis);

      onResizeEnd(finalSize);

      setIsResizing(false);
      setDragOffset(0);
      dragOffsetRef.current = 0;

      // 清理事件监听
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);

      // 重置状态
      cleanupRef.current = null;
    };

    cleanupRef.current = () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    // 绑定 mousemove 
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  useEffect(() => {
    return () => {
      cleanupRef.current?.();
      cleanupRef.current = null;
    };
  }, []);

  return {
    isResizing,
    dragOffset,
    onMouseDown
  };
}
