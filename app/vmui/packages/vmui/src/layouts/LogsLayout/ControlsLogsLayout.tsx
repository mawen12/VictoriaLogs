import { FC, useRef } from "preact/compat";
import classNames from "classnames";
import GlobalSettings, { GlobalSettingsHandle } from "../../components/Configurators/GlobalSettings/GlobalSettings";
import { ControlsProps } from "../Header/HeaderControls/HeaderControls";
import { TimeSelector } from "../../components/Configurators/TimeRangeSettings/TimeSelector/TimeSelector";
import Tenants from "../../components/Configurators/GlobalSettings/TenantsConfiguration/Tenants";
import { ExecutionControls } from "../../components/Configurators/TimeRangeSettings/ExecutionControls/ExecutionControls";
import ShortcutKeys from "../../components/Main/ShortcutKeys/ShortcutKeys";
import { getAppModeEnable } from "../../utils/app-mode";
import Button from "../../components/Main/Button/Button";
import { KeyboardIcon } from "../../components/Main/Icons";

const ControlsLogsLayout: FC<ControlsProps> = ({ isMobile, headerSetup }) => {
  const appModeEnable = getAppModeEnable();
  const settingsRef = useRef<GlobalSettingsHandle>(null);

  return (
    <div
      className={classNames({
        "vm-header-controls": true,
        "vm-header-controls_mobile": isMobile,
      })}
    >

      {/* 租户 */}
      {headerSetup?.tenant && <Tenants/>}
      {/* 事件选择器 */}
      {headerSetup?.timeSelector && <TimeSelector onOpenSettings={settingsRef?.current?.open}/>}
      {/* 执行控制器 */}
      {headerSetup?.executionControls &&  <ExecutionControls/>}
      {/* 全局配置按钮 */}
      <GlobalSettings ref={settingsRef}/>
      {/* 快捷键 */}
      {!isMobile && (
        <ShortcutKeys>
          <Button
            className={appModeEnable ? "" : "vm-header-button"}
            variant="contained"
            color="primary"
            startIcon={<KeyboardIcon/>}
          />
        </ShortcutKeys>
      )}
    </div>
  );
};

export default ControlsLogsLayout;
