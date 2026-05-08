import { FC, ReactNode } from "preact/compat";
import classNames from "classnames";
import { DoneIcon, ErrorIcon, InfoIcon, WarningIcon } from "../Icons";
import "./style.scss";

interface AlertProps {
  variant?: "success" | "error" | "info" | "warning"
  children: ReactNode
  title?: string;
}

const icons = {
  success: <DoneIcon/>,
  error: <ErrorIcon/>,
  warning: <WarningIcon/>,
  info: <InfoIcon/>
};

/**
 * 一个多变体的警告/提示信息框，根据不同类型展示对应的图标和样式
 * 
 * @param variant 支持 success/error/warning/info 四种 
 * @param title 标题
 * @para children 子级
 * @returns 
 */
const Alert: FC<AlertProps> = ({
  variant,
  title,
  children
}) => {

  return (
    <div
      className={classNames({
        "vm-alert": true,
        // 变体对应的样式
        [`vm-alert_${variant}`]: true
      })}
    >
      <div className="vm-alert__backdrop"/>
      {/* 变体对应 icon */}
      <div className="vm-alert__icon">{icons[variant || "info"]}</div>
      {/* 可选标题，仅在提供了才会渲染 */}
      {title && <div className="vm-alert__title">{title}</div>}

      {/* 可选内容主体，仅在提供了才会渲染 */}
      {children && <div
        className={classNames({
        "vm-alert__content": title,
        "vm-alert__title": !title
      })}
      >{children}</div>}
    </div>
  );
};

export default Alert;
