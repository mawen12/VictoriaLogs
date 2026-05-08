// 取当前的路径的截止端口的部分
export const getDefaultServer = (): string => {
  return window.location.href.replace(/(\/(select\/)?vmui\/.*|\/#\/.*)/, "");
};
