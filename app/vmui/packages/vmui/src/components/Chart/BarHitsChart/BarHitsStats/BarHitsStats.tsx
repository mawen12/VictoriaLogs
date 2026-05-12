import { FC } from "preact/compat";
import "uplot/dist/uPlot.min.css";
import useDeviceDetect from "../../../../hooks/useDeviceDetect";
import { formatNumberShort, formatNumber } from "../../../../utils/number";
import { getDurationFromMilliseconds } from "../../../../utils/time";
import "./style.scss";

interface Props {
  totalHits: number;
  isHitsMode: boolean
  durationMs?: number;
}

const BarHitsStats: FC<Props> = ({ totalHits, isHitsMode, durationMs }) => {
  // 移动端检测
  const { isMobile } = useDeviceDetect();

  // 格式化值
  const totalHitsFormat = isMobile ? formatNumberShort(totalHits) : formatNumber(totalHits);
  // 请求耗时格式化
  const durationFormat = durationMs ? getDurationFromMilliseconds(durationMs) : null;

  if (!isHitsMode && !durationFormat) return null;

  return (
    <div className="vm-bar-hits-stats">
      {/* Total 总记录数 */}
      {isHitsMode && (
        <p className="vm-bar-hits-stats__item">
          Total: <b>{totalHitsFormat}</b>
        </p>
      )}

      {/* Query time 执行耗时 */}
      {durationFormat && (
      <p className="vm-bar-hits-stats__item">
        Query time: <b>{durationFormat}</b>
      </p>
      )}
    </div>
  );
};

export default BarHitsStats;
