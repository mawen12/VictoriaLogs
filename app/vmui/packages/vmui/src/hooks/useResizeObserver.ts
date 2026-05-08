import { useEffect, useRef, useState } from "react";

import type { RefObject } from "react";

import { useIsMounted } from "./useIsMounted";

export type Size = {
  width: number | undefined
  height: number | undefined
}

type UseResizeObserverOptions<T extends HTMLElement = HTMLElement> = {
  ref: RefObject<T>
  onResize?: (size: Size) => void
  box?: "border-box" | "content-box" | "device-pixel-content-box"
}

const initialSize: Size = {
  width: undefined,
  height: undefined,
};

/**
 * 监听 DOM 元素尺寸变化，并将新尺寸暴露给调用方
 * 
 * @param ref 目标 DOM 元素
 * @param onResize 回调
 * @param box 盒模型类型
 * @returns 新尺寸
 */
export function useResizeObserver<T extends HTMLElement = HTMLElement>(
  options: UseResizeObserverOptions<T>,
): Size {
  const { ref, box = "content-box" } = options;
  const [{ width, height }, setSize] = useState<Size>(initialSize);
  const isMounted = useIsMounted();
  // 上一次的尺寸
  const previousSize = useRef<Size>({ ...initialSize });
  const onResize = useRef<((size: Size) => void) | undefined>(undefined);
  onResize.current = options.onResize;

  useEffect(() => {
    if (!ref.current) return;

    if (typeof window === "undefined" || !("ResizeObserver" in window)) return;

    // 创建 ResizeObserver，在尺寸变化时提取新的 width/height
    const observer = new ResizeObserver(([entry]) => {
      const boxProp = "borderBoxSize";

      // 提取新的 width/height
      const newWidth = extractSize(entry, boxProp, "inlineSize");
      const newHeight = extractSize(entry, boxProp, "blockSize");

      // 变化比较
      const hasChanged =
        previousSize.current.width !== newWidth ||
        previousSize.current.height !== newHeight;

      if (hasChanged) {
        const newSize: Size = { width: newWidth, height: newHeight };
        previousSize.current.width = newWidth;
        previousSize.current.height = newHeight;

        // 默认走 setSize，当传入了 onResize 则走回调通知
        if (onResize.current) {
          onResize.current(newSize);
        } else {
          // 异步回调保护，组件已卸载时不 setState
          if (isMounted()) {
            setSize(newSize);
          }
        }
      }
    });

    observer.observe(ref.current, { box });

    return () => {
      // 组件挂载时清理，防止资源泄漏
      observer.disconnect();
    };
  }, [box, ref, isMounted]);

  return { width, height };
}

/** @private */
type BoxSizesKey = keyof Pick<
  ResizeObserverEntry,
  "borderBoxSize" | "contentBoxSize" | "devicePixelContentBoxSize"
>

function extractSize(
  entry: ResizeObserverEntry,
  box: BoxSizesKey,
  sizeType: keyof ResizeObserverSize,
): number | undefined {
  if (!entry[box]) {
    if (box === "contentBoxSize") {
      return entry.contentRect[sizeType === "inlineSize" ? "width" : "height"];
    }
    return undefined;
  }

  return Array.isArray(entry[box])
    ? entry[box][0][sizeType]
    : // @ts-expect-error Support Firefox's non-standard behavior
    // 处理 firefox 的非标准行为
    (entry[box][sizeType] as number);
}
