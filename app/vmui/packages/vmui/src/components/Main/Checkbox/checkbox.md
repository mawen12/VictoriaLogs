# Checkbox

## DOM tree

```
Checkbox
├── div
│   └── div
│       └── div
│           └── {customIcon}
└── [span
    └── {label}]
```

## Layout

```
Checkbox
├── div -> {display:flex}
│   └── div -> {display:flex}
│       └── div -> {display:grid}
│           └── {customIcon}
└── [span
    └── {label}]    
```

## Status

- onClick 点击事件

none

## Detail