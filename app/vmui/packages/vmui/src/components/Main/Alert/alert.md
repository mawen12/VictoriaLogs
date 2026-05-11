# Alert

## DOM tree

```
Alert
└── div
    ├── div
    ├── div
    │   └── icon
    ├── [div
    │   └── {title}]
    └── [div
        └── {children}]
```

## Layout

```
Alert
└── div -> {position:relative,display:grid}
    ├── div -> {position:absolute}
    ├── div
    │   └── icon
    ├── [div
    │   └── {title}]
    └── [div
        └── {children}]
```

## Status

none
内部无法控制展示或隐藏，只能由外部控制

## Detail

