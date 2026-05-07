import { FC, useEffect } from "preact/compat";
import Header from "../Header/Header";
import { matchPath, Outlet, useLocation } from "react-router-dom";
import "./style.scss";
import { getAppModeEnable } from "../../utils/app-mode";
import classNames from "classnames";
import Footer from "../Footer/Footer";
import { RouterOptions, routerOptions } from "../../router";
import useDeviceDetect from "../../hooks/useDeviceDetect";
import ControlsLogsLayout from "./ControlsLogsLayout";
import { footerLinksToLogs } from "../../constants/footerLinks";
import WebStorageCheck from "../../components/WebStorageCheck/WebStorageCheck";
import { migrateStorageToPrefixedKeys } from "../../utils/storage";
import { useAppState } from "../../state/common/StateContext";

const LogsLayout: FC = () => {
  // 应用模式开关，开启后隐藏页脚和调整部分样式以适配嵌入式使用场景
  const appModeEnable = getAppModeEnable();
  // 设备检测，判断是否为移动设备以调整布局
  const { isMobile } = useDeviceDetect();
  // 当前路径，用于动态设置页面标题
  const { pathname } = useLocation();
  // 是否为黑暗模式
  const { isDarkTheme } = useAppState();

  // 设置页面 title 的函数
  const setDocumentTitle = () => {
    const matchedEntry = Object.entries(routerOptions).find(([path]) => {
      return matchPath(path, pathname);
    });

    const routeTitle =  (matchedEntry?.[1] as RouterOptions)?.title;
    const defaultTitle = "UI for VictoriaLogs";
    document.title = routeTitle ? `${routeTitle} - ${defaultTitle}` : defaultTitle;
  };

  // 监听路径变化，更新页面标题
  useEffect(setDocumentTitle, [pathname]);

  // 组件挂载时迁移 localStorage 中的旧数据到新的带前缀的键，避免与其他应用的数据冲突
  useEffect(() => {
    const migrateStorage = migrateStorageToPrefixedKeys();
    if (migrateStorage.removed.length || migrateStorage.migrated.length) {
      console.info(migrateStorage);
    }
  }, []);

  return <section
    className={classNames({
    "vm-container": true,
    "vm-container_dark": isDarkTheme
  })}
  >
    <Header controlsComponent={ControlsLogsLayout}/>
    
    <div
      id="vm-body"
      className={classNames({
        "vm-container-body": true,
        "vm-container-body_mobile": isMobile,
        "vm-container-body_app": appModeEnable
      })}
    >
      {/* 根据路由配置渲染对应的页面组件，Outlet 是 React Router 提供的占位组件，用于渲染匹配到的子路由组件 */}
      <Outlet/>
    </div>
    {!appModeEnable && <Footer links={footerLinksToLogs}/>}

    <WebStorageCheck/>
  </section>;
};

export default LogsLayout;
