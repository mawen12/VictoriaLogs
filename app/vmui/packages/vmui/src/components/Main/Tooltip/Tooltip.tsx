import { FC, useEffect, useMemo, useRef, useState, Fragment, createPortal, ReactNode } from "preact/compat";
import "./style.scss";
import useDeviceDetect from "../../../hooks/useDeviceDetect";

interface TooltipProps {
  children: ReactNode
  title: ReactNode
  offset?: { top?: number, left?: number }
  open?: boolean
  disabled?: boolean
  placement?: "bottom-right" | "bottom-left" | "top-left" | "top-right" | "top-center" | "bottom-center"
}

/**
 * 在目标元素旁展示悬停提示，支持多个方向、自动防溢出调整、受控/非受控双模式、移动端检测禁用
 * 
 * @param open 受控模式，外部接管 
 * @returns 
 */
const Tooltip: FC<TooltipProps> = ({
  children,
  title,
  open,
  disabled = false,
  placement = "bottom-center",
  offset = { top: 6, left: 0 }
}) => {
  const { isMobile } = useDeviceDetect();

  // 维护是否打开的状态
  const [isOpen, setIsOpen] = useState(false);
  // 维护 tooltip DOM 尺寸，用于位置计算
  const [popperSize, setPopperSize] = useState({ width: 0, height: 0 });

  // 用于获取获取触发 tooltip 的子元素的 DOM 节点
  const buttonRef = useRef<ReactNode>(null);
  // 读取 tooltip 的 div 阶段，用于获取 tooltip 自身的渲染尺寸
  const popperRef = useRef<HTMLDivElement>(null);

  // 窗口滚动时，自动关闭
  const onScrollWindow = () => setIsOpen(false);

  useEffect(() => {
    if (!popperRef.current || !isOpen) return;
    setPopperSize({
      width: popperRef.current.clientWidth,
      height: popperRef.current.clientHeight
    });
    // 监听 scroll 事件
    window.addEventListener("scroll", onScrollWindow);

    return () => {
      window.removeEventListener("scroll", onScrollWindow);
    };
  }, [isOpen, title]);

  const popperStyle = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const buttonEl = buttonRef?.current?.base as HTMLElement;

    if (!buttonEl || !isOpen) return {};
    const buttonPos = buttonEl.getBoundingClientRect();
    const position = { top: 0, left: 0 };

    // 根据 placement 计算展示位置
    const needAlignRight = placement === "bottom-right" || placement === "top-right";
    const needAlignLeft = placement === "bottom-left" || placement === "top-left";
    const needAlignTop = placement?.includes("top");

    const offsetTop = offset?.top || 0;
    const offsetLeft = offset?.left || 0;

    position.left = buttonPos.left - ((popperSize.width - buttonPos.width) / 2) + offsetLeft;
    position.top = buttonPos.height + buttonPos.top + offsetTop;

    if (needAlignRight) position.left = buttonPos.right - popperSize.width;
    if (needAlignLeft) position.left = buttonPos.left + offsetLeft;
    if (needAlignTop) position.top = buttonPos.top - popperSize.height - offsetTop;

    const { innerWidth, innerHeight } = window;
    // 溢出检测，margin 20px 缓冲
    const margin = 20;
    // 底部溢出检测
    const isOverflowBottom = (position.top + popperSize.height + margin) > innerHeight;
    // 顶部溢出检测
    const isOverflowTop = (position.top - margin) < 0;
    // 右侧溢出检测
    const isOverflowRight = (position.left + popperSize.width + margin) > innerWidth;
    // 左侧溢出检测
    const isOverflowLeft = (position.left - margin) < 0;

    // 底部溢出后，改顶部
    if (isOverflowBottom) position.top = buttonPos.top - popperSize.height - offsetTop;
    // 顶部溢出后，改底部
    if (isOverflowTop) position.top = buttonPos.height + buttonPos.top + offsetTop;
    // 右侧溢出后，改左侧
    if (isOverflowRight) position.left = buttonPos.right - popperSize.width - offsetLeft;
    // 左侧溢出后，改左侧
    if (isOverflowLeft) position.left = buttonPos.left + offsetLeft;

    // 兜底，确保离左上角至少20px
    if (position.top < 0) position.top = 20;
    if (position.left < 0) position.left = 20;

    return position;
  }, [buttonRef, placement, isOpen, popperSize]);

  // 非受控模式，鼠标悬浮时自动打开
  const handleMouseEnter = () => {
    if (typeof open === "boolean") return;
    setIsOpen(true);
  };
  // 非受控模式，鼠标悬浮离开时自动关闭
  const handleMouseLeave = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    if (typeof open === "boolean") setIsOpen(open);
  }, [open]);

  useEffect(() => {
    if (disabled) {
      setIsOpen(false);
    } else if (typeof open === "boolean") {
      setIsOpen(open);
    }
  }, [disabled, open]);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const nodeEl = buttonRef?.current?.base as HTMLElement;
    if (!nodeEl || disabled) return;
    nodeEl.addEventListener("mouseenter", handleMouseEnter);
    nodeEl.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      nodeEl.removeEventListener("mouseenter", handleMouseEnter);
      nodeEl.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [buttonRef, disabled]);

  return (
    <>
      <Fragment
        ref={buttonRef}
      >
        {children}
      </Fragment>

      {/* !isMobile：移动端禁用 */}
      {/* createPortal：挂载到 document.body，避免 overflow:hidden 父容器裁切 */}
      {!isMobile && isOpen && !disabled && createPortal((
        <div
          className="vm-tooltip"
          ref={popperRef}
          style={popperStyle}
        >
          {title}
        </div>), document.body)}
    </>
  );
};

export default Tooltip;
