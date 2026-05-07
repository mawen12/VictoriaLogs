import { createContext, FC, useContext, useEffect, useState, ReactNode } from "preact/compat";
import Alert from "../components/Main/Alert/Alert";
import useDeviceDetect from "../hooks/useDeviceDetect";
import classNames from "classnames";
import { CloseIcon } from "../components/Main/Icons";

interface SnackbarItem {
  // 提示内容
  text: string | ReactNode,
  // 提示类型
  type: "success" | "error" | "info" | "warning"
  // 提示持续时间，单位毫秒，默认为 4000ms
  timeout?: number
}

export interface SnackModel extends SnackbarItem {
  // 提示是否打开
  open?: boolean;
  // 唯一标识符，建议使用时间戳或 UUID
  key?: number;
}

type SnackbarContextType = {
  showInfoMessage: (item: SnackbarItem) => void
};

export const SnackbarContext = createContext<SnackbarContextType>({
  showInfoMessage: () => {
    // default value here makes no sense
  }
});

export const useSnack = (): SnackbarContextType => useContext(SnackbarContext);

export const SnackbarProvider: FC = ({ children }) => {
  // 设备检测
  const { isMobile } = useDeviceDetect();

  // Snackbar 对象
  const [snack, setSnack] = useState<SnackModel>({ text: "", type: "info" });
  // Snackbar 是否打开
  const [open, setOpen] = useState(false);
  // 当前显示的提示信息
  const [infoMessage, setInfoMessage] = useState<SnackbarItem | null>(null);

  // 当 infoMessage 发生变化时，更新 Snackbar 的内容并打开 Snackbar
  useEffect(() => {
    if (!infoMessage) return;
    // 将内容更新到 Snackbar 对象中，并生成唯一 key
    setSnack({
      ...infoMessage,
      key: Date.now()
    });
    // 打开 Snackbar
    setOpen(true);
    // 设置自动关闭的定时器，时间由 infoMessage.timeout 决定，默认为 4000ms
    const timeout = setTimeout(handleClose, infoMessage.timeout || 4000);

    // 清除定时器，防止内存泄漏
    return () => clearTimeout(timeout);
  }, [infoMessage]);

  // 关闭 Snackbar 的函数
  const handleClose = () => {
    // 清空当前提示信息
    setInfoMessage(null);
    // 关闭 Snackbar
    setOpen(false);
  };

  return <SnackbarContext.Provider value={{ showInfoMessage: setInfoMessage }}>
    {/* Snackbar 提示组件 */}
    {open && <div
      className={classNames({
        "vm-snackbar": true,
        "vm-snackbar_mobile": isMobile,
      })}
    >
      {/* 底层为 Alert 组件 */}
      <Alert variant={snack.type}>
        <div className="vm-snackbar-content">
          <span>{snack.text}</span>
          <div
            className="vm-snackbar-content__close"
            onClick={handleClose}
          >
            <CloseIcon/>
          </div>
        </div>
      </Alert>
    </div>}

    {children}

  </SnackbarContext.Provider>;
};


