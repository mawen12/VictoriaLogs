import { FC, useCallback } from "preact/compat";
import Button from "../Main/Button/Button";
import { CopyIcon } from "../Main/Icons";
import Tooltip from "../Main/Tooltip/Tooltip";
import useCopyToClipboard from "../../hooks/useCopyToClipboard";

interface Props {
  title: string;
  getData: () => string;
  successfulCopiedMessage: string;
}

/**
 * 支持内容复制的按钮
 * 
 * @param title 悬浮展示的提示信息
 * @param getData 获取复制数据的函数
 * @param successfulCopiedMessage 复制成功的提示信息
 * @returns 
 */
export const CopyButton: FC<Props> = ({ title, getData, successfulCopiedMessage }) => {
  // 获取内容复制的 hook
  const copyToClipboard = useCopyToClipboard();

  // 点击时动态调用 getData()，然后把结果和提示文案传给复制参数
  const handleClick = useCallback(() => {
    copyToClipboard(getData(), successfulCopiedMessage);
  }, [getData, successfulCopiedMessage]);

  return <Tooltip
    title={title}
  >
    <Button
      variant="text"
      startIcon={<CopyIcon/>}
      // 点击时复制
      onClick={handleClick}
      ariaLabel={title}
    />
  </Tooltip>;
};
