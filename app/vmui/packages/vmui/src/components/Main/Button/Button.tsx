import { FC, MouseEvent as ReactMouseEvent, ReactNode } from "preact/compat";
import classNames from "classnames";
import "./style.scss";

interface ButtonProps {
  variant?: "contained" | "outlined" | "text"
  color?: "primary" | "secondary" | "success" | "error" | "gray"  | "warning" | "white"
  size?: "small" | "medium" | "large"
  ariaLabel?: string // https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-label
  endIcon?: ReactNode
  startIcon?: ReactNode
  fullWidth?: boolean
  disabled?: boolean
  children?: ReactNode
  className?: string
  "data-id"?: string
  onClick?: (e: ReactMouseEvent<HTMLButtonElement>) => void
  onMouseDown?: (e: ReactMouseEvent<HTMLButtonElement>) => void
}

/**
 * 多态的按钮基础元素，支持丰富的变体组合（样式、大小、样色、图标）
 * 
 * @param variant 支持 contained/outlined/text 三种 
 * @param color 支持 primary/secondary/success/error/gray/warning/white 七种
 * @param size 支持 small/medium/large 三种
 * @param onClick 点击行为
 * @param onMouseDown 
 * @returns 
 */
const Button: FC<ButtonProps> = ({
  variant = "contained",
  color = "primary",
  size = "medium",
  ariaLabel,
  children,
  endIcon,
  startIcon,
  fullWidth = false,
  className,
  disabled,
  onClick,
  onMouseDown,
  "data-id": dataId
}) => {

  const classesButton = classNames({
    "vm-button": true,
    [`vm-button_${variant}_${color}`]: true,
    [`vm-button_${size}`]: size,
    // 仅有图标
    "vm-button_icon_only": (startIcon || endIcon) && !children,
    // 撑满容器宽度
    "vm-button_full-width": fullWidth,
    // 同时存在图标和文字
    "vm-button_with-icons": startIcon || endIcon,
    [className || ""]: className
  });

  return (
    <button
      className={classesButton}
      disabled={disabled}
      aria-label={ariaLabel}
      onClick={onClick}
      onMouseDown={onMouseDown}
      data-id={dataId}
    >
      {startIcon}{children}{endIcon}
    </button>
  );
};

export default Button;
