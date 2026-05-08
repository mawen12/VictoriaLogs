import { FC, useEffect, useRef, useState, ReactNode } from "preact/compat";
import classNames from "classnames";
import "./style.scss";

interface ToggleProps {
  options: {value: string, title?: string, icon?: ReactNode}[]
  value: string
  onChange: (val: string) => void
  label?: string
}

/**
 * 多选项的分段控制器，用一个滑动高亮块指示当前选中项
 * 
 * @param param0 
 * @returns 
 */
const Toggle: FC<ToggleProps> = ({ options, value, label, onChange }) => {
  // 维护一个选中项的引用
  const activeRef = useRef<HTMLDivElement>(null);

  // 维护选中项的 DOM 尺寸
  const [position, setPosition] = useState({
    width: "0px",
    left: "0px",
    borderRadius: "0px"
  });

  const createHandlerChange = (value: string) => () => {
    onChange(value);
  };

  useEffect(() => {
    if (!activeRef.current) {
      setPosition({
        width: "0px",
        left: "0px",
        borderRadius: "0px"
      });
      return;
    }
    const index = options.findIndex(o => o.value === value);
    const { width: widthRect } = activeRef.current.getBoundingClientRect();

    let width = widthRect;
    // 每格等宽对齐
    let left = index * width;
    let borderRadius = "0";
    // 首项：左侧圆角
    if (index === 0) borderRadius = "16px 0 0 16px";

    // 末项：右侧圆角
    if (index === options.length - 1) {
      borderRadius = "10px";
      left -= 1;
      borderRadius = "0 16px 16px 0";
    }

    // 中间项，宽度和left各微调 +-1px，保证视觉无间隙
    if (index !== 0 && (index !== options.length - 1)) {
      width += 1;
      left -= 1;
    }


    setPosition({ width: `${width}px`, left: `${left}px`, borderRadius });
  }, [activeRef, value, options]);

  return (
    <div className="vm-toggles">
      {label && (
        <label className="vm-toggles__label">
          {label}
        </label>
      )}
      <div
        className="vm-toggles-group"
        // 使用 CSS Grid 的 repeat 实现等分布局
        style={{ gridTemplateColumns: `repeat(${options.length}, 1fr)` }}
      >
        {/* position.borderRadius 为空时不显示高亮块，避免初始化闪烁 */}
        {position.borderRadius && <div
          className="vm-toggles-group__highlight"
          style={position}
        />}
        {options.map((option, i) => (
          <div
            className={classNames({
              "vm-toggles-group-item": true,
              "vm-toggles-group-item_first": i === 0,
              "vm-toggles-group-item_active": option.value === value,
              "vm-toggles-group-item_icon": option.icon && option.title
            })}
            // 点击任意项，通知父组件
            onClick={createHandlerChange(option.value)}
            key={option.value}
            ref={option.value === value ? activeRef : null}
          >
            {option.icon}
            {option.title}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Toggle;
