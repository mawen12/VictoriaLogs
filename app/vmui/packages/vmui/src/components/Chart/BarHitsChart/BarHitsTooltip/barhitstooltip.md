# BarHitsTooltip

## DOM tree

```
BarHitsTooltip
└── div
    ├── div
    │   └── div
    │       ├── span
    │       │   └── [background]
    │       └── p
    │           ├── span
    │           │   └── [item.label]
    │           └── span
    │               └── [item.value]
    ├── div
    │   └── div
    │       └── [item.timestamp]
    └── div
        └── div
            └── Click a bar to set the time range
```

## Layout

```
BarHitsTooltip
└── div -> {position:absolute,display:grid}
    ├── div
    │   └── div
    │       ├── span
    │       │   └── [background]
    │       └── p -> {display:grid,}
    │           ├── span
    │           │   └── [item.label]
    │           └── span
    │               └── [item.value]
    ├── div
    │   └── div
    │       └── [item.timestamp]
    └── div
        └── div
            └── Click a bar to set the time range
```

## Status


## Detail

