# Accordion

## DOM tree

```
Accordion
├── header
│   ├── {title}
│   └── div
│       └── ArrowDownIcon
└── [section
    └── {children}]
```

## Layout

```
Accordion
├── header -> {position:relative,display:grid}
│   ├── {title}
│   └── div -> {position:absolute,display:flex}
│       └── ArrowDownIcon
└── [section
    └── {children}]
```

## Status

- isOpen 是否展开
- toggleOpen 触发展开/关闭
- defaultExpanded 外部参数传入

```
Accordion
├── header -> {toggleOpen}
│   └── div -> {isOpen: rotate(180)} 
└── [section] {isOpen: show}
```

## Detail

当发现有选中文本的时候，不触发折叠