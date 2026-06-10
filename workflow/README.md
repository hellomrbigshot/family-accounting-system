# AI 开发工作流文件

本目录存放 **SPEC → CODE → VERIFY → TEST → GREEN** 五阶段流程的模板与当前任务文档。

## 目录结构

```
workflow/
├── README.md           # 本说明
├── templates/          # 模板（勿直接编辑，复制到 current/ 使用）
│   ├── SPEC.md
│   ├── VERIFY.md
│   ├── TEST.md
│   ├── GREEN.md
│   └── RETROACTIVE-SPEC.md
└── current/            # 当前任务的活跃文档（AI 开发时读写此目录）
    ├── SPEC.md
    ├── VERIFY.md
    ├── TEST.md
    └── GREEN.md
```

## 快速开始

```bash
# 开始新任务：从模板复制到 current/
cp workflow/templates/SPEC.md workflow/current/SPEC.md
cp workflow/templates/VERIFY.md workflow/current/VERIFY.md
cp workflow/templates/TEST.md workflow/current/TEST.md
cp workflow/templates/GREEN.md workflow/current/GREEN.md
```

然后按顺序完成各阶段，详见根目录 [AGENTS.md](../AGENTS.md)。

## 阶段顺序

1. **SPEC** — 定义验收标准，确认后再写代码
2. **CODE** — 实现功能，记录改动
3. **VERIFY** — 浏览器视觉确认
4. **TEST** — 编写并运行 E2E 测试
5. **GREEN** — 全部通过，任务完成

## 历史功能（补档）

已实现、但引入流程前交付的功能见 [`history/`](history/)：

- [`history/FEATURE-INVENTORY.md`](history/FEATURE-INVENTORY.md) — 功能清单与 E2E 覆盖状态
- [`history/features/`](history/features/) — 各模块追溯 SPEC
- [`../e2e/scripts/`](../e2e/scripts/) · [`../e2e/scenarios/`](../e2e/scenarios/) — agent-browser E2E 脚本

补档步骤详见 [`history/README.md`](history/README.md)。
