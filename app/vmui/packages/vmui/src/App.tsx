import { FC, useState } from "preact/compat";
import { HashRouter, Route, Routes } from "react-router-dom";
import AppContextProvider from "./contexts/AppContextProvider";
import ThemeProvider from "./components/Main/ThemeProvider/ThemeProvider";
import QueryPage from "./pages/QueryPage/QueryPage";
import LogsLayout from "./layouts/LogsLayout/LogsLayout";
import OverviewPage from "./pages/OverviewPage/OverviewPage";
import StreamContext from "./pages/StreamContext/StreamContext";
import router from "./router";
import "./constants/markedPlugins";
import PreviewIcons from "./components/Main/Icons/PreviewIcons";
import AllButtonsPreview from "./components/Main/Button/AllButtonsPreview";

const isDev = import.meta.env.DEV;

const App: FC = () => {
  // 主题加载完成标志，确保在主题变量设置完成后再渲染页面，避免闪烁
  const [loadedTheme, setLoadedTheme] = useState(false);

  return <>
    {/* 基于 Hash 的路由 */}
    <HashRouter> 
      {/* 应用上下文提供者(AppState、TimeState、QueryState、Snackbar、LogsState、OverviewState) */}
      <AppContextProvider>
        <>
          {/* 主题提供者，支持主题切换 */}
          <ThemeProvider onLoaded={setLoadedTheme}/>
          {loadedTheme && (
            // 路由配置，根据路径渲染不同页面
            // / -> LogsLayout -> QueryPage
            // /overview -> LogsLayout -> OverviewPage
            // /stream-context/:_stream_id/:_time -> LogsLayout -> StreamContext 
            // /icons -> PreviewIcons (仅开发环境)
            // /buttons -> AllButtonsPreview (仅开发环境)
            <Routes>
              <Route
                path={"/"}
                element={<LogsLayout/>}
              >
                <Route
                  path={"/"}
                  element={<QueryPage/>}
                />
                <Route
                  path={router.overview}
                  element={<OverviewPage/>}
                />
                <Route
                  path={router.streamContext}
                  element={<StreamContext/>}
                />

                {/* 仅开发环境 */}
                {isDev && (
                  <>
                    <Route
                      path="/icons"
                      element={<PreviewIcons />}
                    />
                    <Route
                      path="/buttons"
                      element={<AllButtonsPreview />}
                    />
                  </>
                )}
              </Route>
            </Routes>
          )}
        </>
      </AppContextProvider>
    </HashRouter>
  </>;
};

export default App;
