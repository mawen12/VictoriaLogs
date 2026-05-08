import {
  FC,
  useEffect,
  useCallback,
  useRef,
  useMemo,
  FormEvent,
  KeyboardEvent,
  MouseEvent,
  HTMLInputTypeAttribute,
  ReactNode,
  forwardRef
} from "preact/compat";
import classNames from "classnames";
import { useAppState } from "../../../state/common/StateContext";
import useDeviceDetect from "../../../hooks/useDeviceDetect";
import TextFieldMessage from "./TextFieldMessage";
import "./style.scss";

export type TextFieldKeyboardEvent = KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>;

interface TextFieldProps {
  label?: string,
  value?: string | number
  type?: HTMLInputTypeAttribute | "textarea"
  error?: string
  warning?: string
  placeholder?: string
  endIcon?: ReactNode
  startIcon?: ReactNode
  disabled?: boolean
  autofocus?: boolean
  helperText?: string
  inputmode?: "search" | "text" | "email" | "tel" | "url" | "none" | "numeric" | "decimal"
  caretPosition?: [number, number]
  onChange?: (value: string) => void
  onEnter?: () => void
  onKeyDown?: (e: TextFieldKeyboardEvent) => void
  onFocus?: () => void
  onBlur?: () => void
  onChangeCaret?: (position: [number, number]) => void
}

/**
 * 提供一个统一的文本输入基础组件，同时支持 input 和 textarea 两种形态，
 * 并扩占了光标追踪、受控 ref、Enter 回调等增强能力
 */
const TextField: FC<TextFieldProps> = forwardRef<HTMLInputElement | HTMLTextAreaElement, TextFieldProps>((
  {
    label,
    value,
    type = "text",
    error = "",
    warning = "",
    helperText = "",
    placeholder,
    endIcon,
    startIcon,
    disabled = false,
    autofocus = false,
    inputmode = "text",
    caretPosition,
    onChange,
    onEnter,
    onKeyDown,
    onFocus,
    onBlur,
    onChangeCaret,
  },
  extRef
) => {
  const { isDarkTheme } = useAppState();
  const { isMobile } = useDeviceDetect();

  // 维护 input 元素引用
  const inputRef = useRef<HTMLInputElement>(null);
  // 维护 textarea 元素引用
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  // 根据 type 选择激活的 href
  const fieldRef = useMemo(() => type === "textarea" ? textareaRef : inputRef, [type]);

  const inputClasses = classNames({
    "vm-text-field__input": true,
    "vm-text-field__input_error": error,
    "vm-text-field__input_warning": !error && warning,
    "vm-text-field__input_icon-start": startIcon,
    "vm-text-field__input_disabled": disabled,
    "vm-text-field__input_textarea": type === "textarea",
  });

  // 非受控模式，在 keydown/keyup/mouseup/change 时均更新光标位置
  const updateCaretPosition = (target: HTMLInputElement | HTMLTextAreaElement) => {
    if (!onChangeCaret) return;
    const { selectionStart, selectionEnd } = target;
    onChangeCaret && onChangeCaret([selectionStart || 0, selectionEnd || 0]);
  };

  const handleMouseUp = (e: MouseEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    updateCaretPosition(e.currentTarget);
  };

  const handleKeyDown = (e: TextFieldKeyboardEvent) => {
    onKeyDown && onKeyDown(e);
    const { key, ctrlKey, metaKey } = e;
    const isEnter = key === "Enter";
    // 普通 input，Enter 直接触发 onEnter；
    // textarea 需要 Ctrl/Meta + Enter 才触发，其普通 Enter 用于换行
    const runByEnter = type !== "textarea" ? isEnter : isEnter && (metaKey || ctrlKey);
    if (runByEnter && onEnter) {
      e.preventDefault();
      onEnter();
    }
  };

  const handleKeyUp = (e: TextFieldKeyboardEvent) => {
    updateCaretPosition(e.currentTarget);
  };

  const handleChange = (e: FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (disabled) return;
    onChange && onChange(e.currentTarget.value);
    updateCaretPosition(e.currentTarget);
  };

  const handleFocus = () => {
    onFocus && onFocus();
  };

  const handleBlur = () => {
    onBlur && onBlur();
  };

  const setSelectionRange = (range: [number, number]) => {
    try {
      fieldRef.current && fieldRef.current.setSelectionRange(range[0], range[1]);
    } catch (e) {
      return e;
    }
  };

  const setExternalRef = useCallback((element: HTMLInputElement | HTMLTextAreaElement | null) => {
    if (extRef) {
      if (typeof extRef === "function") {
        extRef(element);
      } else {
        extRef.current = element;
      }
    }
  }, []);

  // 同时写入 input 和外部 ref
  const setInputRefs = useCallback((element: HTMLInputElement | null) => {
    setExternalRef(element);
    inputRef.current = element;
  }, []);

  // 同时写入 textarea 和外部 ref
  const setTextareaRefs = useCallback((element: HTMLTextAreaElement | null) => {
    setExternalRef(element);
    textareaRef.current = element;
  }, []);


  useEffect(() => {
    if (!autofocus || isMobile) return;
    fieldRef?.current?.focus && fieldRef.current.focus();
  }, [fieldRef, autofocus]);

  // 受控模式，外部可以直接更新光标位置
  useEffect(() => {
    caretPosition && setSelectionRange(caretPosition);
  }, [caretPosition]);

  return (
    <label
      className={classNames({
        "vm-text-field": true,
        "vm-text-field_textarea": type === "textarea",
        "vm-text-field_dark": isDarkTheme
      })}
      data-replicated-value={value}
    >
      {startIcon && <div className="vm-text-field__icon-start">{startIcon}</div>}
      {endIcon && <div className="vm-text-field__icon-end">{endIcon}</div>}
      {type === "textarea"
        ? (
          <textarea
            name={label || placeholder}
            className={inputClasses}
            disabled={disabled}
            ref={setTextareaRefs}
            value={value}
            rows={1}
            inputMode={inputmode}
            placeholder={placeholder}
            autoCapitalize={"none"}
            onInput={handleChange}
            onKeyDown={handleKeyDown}
            onKeyUp={handleKeyUp}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onMouseUp={handleMouseUp}
          />
        )
        : (
          <input
            name={label || placeholder}
            className={inputClasses}
            disabled={disabled}
            ref={setInputRefs}
            value={value}
            type={type}
            placeholder={placeholder}
            inputMode={inputmode}
            autoCapitalize={"none"}
            onInput={handleChange}
            onKeyDown={handleKeyDown}
            onKeyUp={handleKeyUp}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onMouseUp={handleMouseUp}
          />
        )
      }
      {/* 标签使用 label 包裹整体，点击 label 可聚焦输入框 */}
      {label && <span className="vm-text-field__label">{label}</span>}
      <TextFieldMessage
        error={error}
        warning={warning}
        info={helperText}
      />
    </label>
  );
});

export default TextField;
