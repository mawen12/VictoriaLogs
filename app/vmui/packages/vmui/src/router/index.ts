// 路由配置
const router = {
  home: "/",
  overview: "/overview",
  streamContext: "/stream-context/:_stream_id/:_time",
  icons: "/icons",
};

export interface RouterOptionsHeader {
  // 是否显示租户
  tenant?: boolean,
  // 是否显示时间选择器
  timeSelector?: boolean,
  // 是否显示执行控制
  executionControls?: boolean,
}

export interface RouterOptions {
  // 页面标题
  title?: string,
  header: RouterOptionsHeader
}

// 定义不同路由下的配置选项
export const routerOptions: { [key: string]: RouterOptions } = {
  [router.home]: {
    title: "Query",
    header: {
      tenant: true,
      timeSelector: true,
      executionControls: true,
    }
  },
  [router.overview]: {
    title: "Overview",
    header: {
      tenant: true,
      timeSelector: true,
      executionControls: true,
    }
  },
  [router.icons]: {
    title: "Icons",
    header: {}
  },
  [router.streamContext]: {
    title: "Stream context",
    header: {}
  }
};

export default router;
