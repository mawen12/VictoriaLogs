# Toggle

## DOM tree

```
Toogle
└── div
    ├── [div
    │   └── label
    │       └── {label}]
    ├── [div]    
    └── div
        └── div
            ├── {option.icon}
            └── {option.title}
```

## Layout

```
Toogle
└── div -> {position:relative,display:grid}
    ├── [div
    │   └── label
    │       └── {label}]
    ├── [div] -> {position:absolute}   
    └── div -> {position:relative,display:grid}
        └── div -> {position:relative,display:grid}
            ├── {option.icon}
            └── {option.title}
```

## Status

- position 设置高亮块

## Detail
