import { useEffect, useState } from "preact/compat";
import { isMobileAgent } from "../utils/detect-device";
import useWindowSize from "./useWindowSize";

/**
 * 当 UA 为手机端，或宽度小于 500 时，视作移动端
 * 
 * @returns 
 */
export const getIsMobile = () => {
  // UA 设备嗅探
  const mobileAgent = isMobileAgent();
  // 视口宽度小于 500
  const smallWidth = window.innerWidth < 500;
  return mobileAgent || smallWidth;
};

/**
 * 判断当前是否应按移动端布局处理，并在窗口尺寸变化时自动更新结果
 * 
 * @returns 
 */
export default function useDeviceDetect() {
  const windowSize = useWindowSize();
  const [isMobile, setMobile] = useState(getIsMobile());

  // 订阅 useWindowSize
  useEffect(() => {
    // 更新检测结果
    setMobile(getIsMobile());
  }, [windowSize]);

  return { isMobile };
}
