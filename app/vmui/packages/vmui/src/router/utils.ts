import { routerOptions } from "./index";
import { NavigationItem } from "./navigation";

const routePathToTitle = (path: string): string => {
  try {
    return path
      .replace(/^\/+/, "") // Remove leading slashes
      .replace(/-/g, " ") // Replace hyphens with spaces
      .trim() // Trim whitespace from both ends
      .replace(/^\w/, (c) => c.toUpperCase()); // Capitalize the first character
  } catch (e) {
    return path;
  }
};

// 为 menu 创建 label
export const processNavigationItems = (items: NavigationItem[]): NavigationItem[] => {
  // 隐藏不显示的 item
  return items.filter((item) => !item.hide).map((item) => {
    // 构造新 item
    const newItem: NavigationItem = { ...item };

    // 使用 value 构造 label
    if (newItem.value && !newItem.label) {
      newItem.label = routerOptions[newItem.value]?.title || routePathToTitle(newItem.value);
    }

    // 递归处理子 menu
    if (newItem.submenu && newItem.submenu.length > 0) {
      newItem.submenu = processNavigationItems(newItem.submenu);
    }

    return newItem;
  });
};
