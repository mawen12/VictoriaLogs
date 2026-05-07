import { FC, useMemo } from "preact/compat";
import { RouterOptions, routerOptions, RouterOptionsHeader } from "../../../router";
import { matchPath, useLocation } from "react-router-dom";
import Button from "../../../components/Main/Button/Button";
import { MoreIcon } from "../../../components/Main/Icons";
import classNames from "classnames";
import { getAppModeEnable } from "../../../utils/app-mode";
import Modal from "../../../components/Main/Modal/Modal";
import useBoolean from "../../../hooks/useBoolean";
import { HeaderProps } from "../Header";
import "./style.scss";

export interface ControlsProps {
  displaySidebar: boolean;
  isMobile?: boolean;
  headerSetup?: RouterOptionsHeader;
}

const HeaderControls: FC<ControlsProps & HeaderProps> = ({
  controlsComponent: ControlsComponent,
  isMobile,
  ...props
}) => {
  const appModeEnable = getAppModeEnable();
  const { pathname } = useLocation();

  const {
    value: openList,
    toggle: handleToggleList,
    setFalse: handleCloseList,
  } = useBoolean(false);

  const headerSetup = useMemo(() => {
    const matchedEntry = Object.entries(routerOptions).find(([path]) => {
      return matchPath(path, pathname);
    });

    return (matchedEntry?.[1] as RouterOptions)?.header || {};
  }, [pathname]);

  const controls = (
    <ControlsComponent
      {...props}
      isMobile={isMobile}
      headerSetup={headerSetup}
    />
  );

  // 移动端
  if (isMobile) {
    return (
      <>
        {/* 移动端控制按钮 */}
        <div>
          <Button
            className={classNames({
              "vm-header-button": !appModeEnable
            })}
            startIcon={<MoreIcon/>}
            onClick={handleToggleList}
            ariaLabel={"controls"}
          />
        </div>
        {/* 移动端控制弹窗 */}
        <Modal
          title={"Controls"}
          onClose={handleCloseList}
          isOpen={openList}
          className={classNames({
            "vm-header-controls-modal": true,
            "vm-header-controls-modal_open": openList,
          })}
        >
          {controls}
        </Modal>
      </>
    );
  }

  // 非移动端直接返回控制组件
  return controls;
};

export default HeaderControls;
