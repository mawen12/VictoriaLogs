import { FC, useMemo, ComponentType } from "preact/compat";
import { NavLink, useNavigate } from "react-router-dom";
import router from "../../router";
import { getAppModeEnable, getAppModeParams } from "../../utils/app-mode";
import { LogoLogsIcon } from "../../components/Main/Icons";
import { getCssVariable } from "../../utils/theme";
import "./style.scss";
import classNames from "classnames";
import { useAppState } from "../../state/common/StateContext";
import HeaderNav from "./HeaderNav/HeaderNav";
import SidebarHeader from "./SidebarNav/SidebarHeader";
import HeaderControls, { ControlsProps } from "./HeaderControls/HeaderControls";
import useDeviceDetect from "../../hooks/useDeviceDetect";
import useWindowSize from "../../hooks/useWindowSize";

export interface HeaderProps {
  controlsComponent: ComponentType<ControlsProps>
}
const Logo = () => <NavLink to={router.home}><LogoLogsIcon/></NavLink>;

const Header: FC<HeaderProps> = ({ controlsComponent }) => {
  const { isMobile } = useDeviceDetect();

  const windowSize = useWindowSize();
  // 当窗口宽度小于 1000px 时显示侧边栏导航，否则显示顶部导航
  const displaySidebar = useMemo(() => window.innerWidth < 1000, [windowSize]);
  // 是否为黑暗模式
  const { isDarkTheme } = useAppState();
  const appModeEnable = getAppModeEnable();

  // 获取主色调
  const primaryColor = useMemo(() => {
    const variable = isDarkTheme ? "color-background-block" : "color-primary";
    return getCssVariable(variable);
  }, [isDarkTheme]);

  // 获取背景和颜色
  const { background, color } = useMemo(() => {
    const { headerStyles: {
      background = appModeEnable ? "#FFF" : primaryColor,
      color = appModeEnable ? primaryColor : "#FFF",
    } = {} } = getAppModeParams();

    return { background, color };
  }, [primaryColor]);

  // 导航
  const navigate = useNavigate();

  // 点击 logo 时的行为
  const onClickLogo = (e: MouseEvent) => {
    const { ctrlKey, metaKey } = e;
    const ctrlMetaKey = ctrlKey || metaKey;
    if (ctrlMetaKey) return; // open in new tab

    // 阻止默认行为，避免在某些浏览器中触发页面刷新
    e.preventDefault();
    // 导航到 home 路由
    navigate({ pathname: router.home });
    // 强制刷新页面，确保在某些特殊环境下（如嵌入式使用）能够正确重置状态
    window.location.reload();
  };

  return <header
    className={classNames({
      "vm-header": true,
      "vm-header_app": appModeEnable,
      "vm-header_dark": isDarkTheme,
      "vm-header_sidebar": displaySidebar,
      "vm-header_mobile": isMobile
    })}
    style={{ background, color }}
  >
    {/* 确定 sidebar 的展示方式 */}
    {displaySidebar ? (
      // 以 sidebar 形式展示
      <SidebarHeader
        background={background}
        color={color}
      />
    ) : (
      <>
        {!appModeEnable && (
          // logo 区域
          <div
            className="vm-header-logo"
            onClick={onClickLogo}
            style={{ color }}
          >
            {<Logo/>}
          </div>
        )}
        {/* 导航栏 */}
        <HeaderNav
          color={color}
          background={background}
        />
      </>
    )}

    {displaySidebar && (
      // 展示 logo
      <div
        className={classNames({
          "vm-header-logo": true,
          "vm-header-logo_mobile": true,
        })}
        onClick={onClickLogo}
        style={{ color }}
      >
        {<Logo/>}
      </div>
    )}

    {/* Header 控制组件 */}
    <HeaderControls
      controlsComponent={controlsComponent}
      displaySidebar={displaySidebar}
      isMobile={isMobile}
    />
  </header>;
};

export default Header;
