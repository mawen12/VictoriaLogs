import { FC, useState, useEffect, ReactNode } from "preact/compat";
import { ArrowDownIcon } from "../Icons";
import "./style.scss";

interface AccordionProps {
  title: ReactNode
  children: ReactNode
  defaultExpanded?: boolean
  onChange?: (value: boolean) => void
}

/**
 * 提供一个可折叠面板，支持默认展开、受外部重置、状态变更回调，选中文本时不误触折叠
 * 
 * @param defaultExpanded 是否默认展开
 * @param onChange 回调
 * @param title 标题
 * @param children 子级
 * @returns 
 */
const Accordion: FC<AccordionProps> = ({
  defaultExpanded = false,
  onChange,
  title,
  children
}) => {
  // 维护是否展开的状态
  const [isOpen, setIsOpen] = useState(defaultExpanded);

  // 
  const toggleOpen = () => {
    const selection = window.getSelection();
    // 选中文本时，不误触折叠
    if (selection && selection.toString()) {
      return; // If the text is selected, cancel the execution of toggle.
    }

    setIsOpen((prev) => {
      const newState = !prev;
      // 状态切换后通知外部
      onChange && onChange(newState);
      return newState;
    });
  };

  // 支持外部重置，defaultExpanded 变化会同步到内部状态
  useEffect(() => {
    setIsOpen(defaultExpanded);
  }, [defaultExpanded]);

  return (
    <>
      <header
        // UI 状态与样式联动，提供 open 对应的样式
        className={`vm-accordion-header ${isOpen && "vm-accordion-header_open"}`}
        onClick={toggleOpen}
      >
        {title}
        {/* UI 状态与样式联动，提供 open 对应的样式 */}
        <div className={`vm-accordion-header__arrow ${isOpen && "vm-accordion-header__arrow_open"}`}>
          <ArrowDownIcon />
        </div>
      </header>
      {/* 内容区仅在展开后渲染 */}
      {isOpen && (
        <section
          className="vm-accordion-section"
          key="content"
        >
          {children}
        </section>
      )}
    </>
  );
};

export default Accordion;
