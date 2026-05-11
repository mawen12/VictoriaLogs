# Tooltip

## DOM tree

```
Tooltip
├── Fragment
│   └── {children}
└── [div
    └── {title}]
```

## Layout

```
Tooltip
├── Fragment
│   └── {children}
└── [div -> {position:fixed}
    └── {title}]
```

## Status

- isOpen 内部控制是否显示
- popperSize 展示的尺寸
- popperStyle 展示的样式
- open 外部控制是否显示
- disable 外部控制是否禁用
- buttonRef 用于获取获取触发 tooltip 的子元素的 DOM 节点
- popperRef 读取 tooltip 的 div 阶段，用于获取 tooltip 自身的渲染尺寸

## Detail

对展示时出现溢出的场景进行了优化
