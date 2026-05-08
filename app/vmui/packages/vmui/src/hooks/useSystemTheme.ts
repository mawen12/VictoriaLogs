import { useEffect, useState } from "preact/compat";
import { isSystemDark } from "../utils/theme";

/**
 * 系统主题侦测 hook
 * 
 * @returns 
 */
const useThemeDetector = () => {
  // 初始获取当前系统主题
  const [isDarkTheme, setIsDarkTheme] = useState(isSystemDark());

  const mqListener = ((e: MediaQueryListEvent) => {
    setIsDarkTheme(e.matches);
  });

  useEffect(() => {
    const darkThemeMq = window.matchMedia("(prefers-color-scheme: dark)");
    // 订阅 change 事件
    darkThemeMq.addEventListener("change", mqListener);
    // 组件卸载时移除监听，避免事件泄漏
    return () => darkThemeMq.removeEventListener("change", mqListener);
  }, []);

  return isDarkTheme;
};

export default useThemeDetector;
