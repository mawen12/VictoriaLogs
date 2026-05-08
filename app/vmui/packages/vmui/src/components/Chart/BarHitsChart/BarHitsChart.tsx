import { FC, useMemo, useState } from "preact/compat";
import "./style.scss";
import "uplot/dist/uPlot.min.css";
import { AlignedData } from "uplot";
import { TimeParams } from "../../../types";
import { LogHits } from "../../../api/types";
import { GRAPH_QUERY_MODE, GRAPH_STYLES, GraphOptions } from "./types";
import BarHitsOptions from "./BarHitsOptions/BarHitsOptions";
import BarHitsPlot from "./BarHitsPlot/BarHitsPlot";
import { calculateTotalHits } from "../../../utils/logs";
import BarHitsStats from "./BarHitsStats/BarHitsStats";
import { HitsChartAlert } from "../../../pages/QueryPage/HitsChart/hooks/useHitsChartAlert";
import Alert from "../../Main/Alert/Alert";

interface Props {
  logHits: LogHits[];
  data: AlignedData;
  query?: string;
  period: TimeParams;
  durationMs?: number
  isOverview?: boolean;
  alertData: HitsChartAlert;
  setPeriod: ({ from, to }: { from: Date, to: Date }) => void;
}

/**
 * 维护图表配置状态，根据配置决定是否显示统计和图表
 * 
 * @param param0 
 * @returns 
 */
const BarHitsChart: FC<Props> = ({
  logHits,
  data: _data,
  query,
  period,
  setPeriod,
  durationMs,
  isOverview,
  alertData,
}) => {
  // 维护图标选项状态
  const [graphOptions, setGraphOptions] = useState<GraphOptions>({
    // 图标样式
    graphStyle: GRAPH_STYLES.BAR,
    // 查询模式
    queryMode: GRAPH_QUERY_MODE.hits,
    // 是否基于 stacked
    stacked: false,
    // 是否采用累积
    cumulative: false,
    // 是否采用填充
    fill: false,
    // 是否隐藏图表
    hideChart: false,
  });

  const isHitsMode = graphOptions.queryMode === GRAPH_QUERY_MODE.hits;
  // 缓存累积计算的总数，仅当 logHits 变化时才重新计算
  const totalHits = useMemo(() => calculateTotalHits(logHits), [logHits]);

  return (
    <div className="vm-bar-hits-chart__wrapper">
      <div className="vm-bar-hits-chart-header">
        {!graphOptions.hideChart && (
          <BarHitsStats
            totalHits={totalHits}
            isHitsMode={isHitsMode}
            durationMs={durationMs}
          />
        )}

        <BarHitsOptions
          query={query}
          isHitsMode={isHitsMode}
          isOverview={isOverview}
          onChange={setGraphOptions}
        />
      </div>

      {alertData && (
        <div className="vm-query-page-chart__empty">
          <Alert {...alertData}>{alertData.message}</Alert>
        </div>
      )}

      {!graphOptions.hideChart && (
        <BarHitsPlot
          logHits={logHits}
          totalHits={totalHits}
          data={_data}
          period={period}
          setPeriod={setPeriod}
          graphOptions={graphOptions}
        />
      )}
    </div>
  );
};

export default BarHitsChart;
