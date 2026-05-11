# Button

## DOM tree

```
Button
└── button
    ├── [{startIcon}]
    ├── {children}
    └── [{endIcon}]
```

## Layout

```
Button
└── button -> {display:inline-flex}
    ├── [{startIcon}]
    ├── {children}
    └── [{endIcon}]
```

## Status

- disabled 禁用
- onClick 点击事件，外部传入
- onMouseDown 鼠标按下的瞬间

```
mousedown
↓
mouseup
↓
click
```

无内部状态。

## Detail