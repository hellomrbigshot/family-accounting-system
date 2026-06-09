# 历史功能补档指南

`workflow/current/` 只用于**当前进行中的任务**。已实现的功能归档在 `workflow/history/features/`，自然语言验证说明在 `e2e/scenarios/`，稳定 E2E 守门脚本在 `e2e/scripts/`。

## 为什么要补档

项目在引入五阶段流程前已有大量功能，缺少当时的 SPEC / VERIFY 文档，也几乎没有 E2E 测试。补档目的是：

1. 为现有功能建立**可追溯的验收标准**（便于回归与 AI 理解）
2. 建立 **E2E 覆盖清单**，按模块逐步补齐自动化测试
3. 新功能开发时参考同模块历史文档，避免重复遗漏

## 补档 vs 新开发

| | 新功能（`workflow/current/`） | 历史功能（`workflow/history/`） |
|---|---|---|
| 时机 | 开发前写 SPEC，开发后走全流程 | 从代码/API **反向追溯** |
| SPEC | 与用户确认后再 CODE | 标记 `source: retroactive`，从实现推导 |
| VERIFY | 必须浏览器逐项验证 | 可选：补一次 MCP 验证并记录 |
| TEST | 必须编写并通过 E2E | 按 [`FEATURE-INVENTORY.md`](FEATURE-INVENTORY.md) 优先级补 E2E |
| GREEN | 五阶段全完成 | `legacy-green`：代码已上线；`full-green`：E2E 也已覆盖 |

## 补档步骤（每个功能模块）

### 1. 在功能清单中登记

编辑 [`FEATURE-INVENTORY.md`](FEATURE-INVENTORY.md)，确认模块 ID、页面路径、关联 API、E2E 文件。

### 2. 创建追溯 SPEC

```bash
mkdir -p workflow/history/features/<模块ID>
cp workflow/templates/SPEC.md workflow/history/features/<模块ID>/SPEC.md
```

填写 SPEC 时：

- 任务名称注明 `[追溯]` 前缀
- 类型选 `retroactive`
- 验收标准从**现有页面行为 + backend/docs 接口**推导
- 「实现记录」填主要源码路径，而非本次改动

### 3. 标记 GREEN（legacy）

```bash
cp workflow/templates/GREEN.md workflow/history/features/<模块ID>/GREEN.md
```

- 勾选「代码已上线、功能可用」
- E2E 状态在 FEATURE-INVENTORY 中单独跟踪

### 4. 编写 VERIFY / E2E

在 `e2e/scenarios/<模块>.md` 中，将 SPEC 的每条 AC 写成自然语言步骤与断言，供 VERIFY 阶段用 agent-browser 探索验证。

TEST 阶段只维护少量稳定确定性脚本：`e2e/scripts/auth.sh` 与 `e2e/scripts/smoke.sh`。复杂流程不长期纳入 `pnpm test:e2e` 守门，避免测试体系过重和脆弱。

更新 FEATURE-INVENTORY 中该模块状态时区分：

- `scenarios`：是否已有 VERIFY 自然语言说明
- `e2e`：是否被 `auth` / `smoke` 稳定脚本覆盖

### 5. 模块 E2E 全绿后

- 将 GREEN.md 状态改为 `full-green`
- 在 FEATURE-INVENTORY 中将 workflow 与 E2E 均标为 ✅。未纳入稳定脚本但已有 VERIFY 说明的模块保持 🔄。

## 推荐补档顺序

按用户路径与依赖关系，建议优先级：

1. **auth** — 其他测试的前置登录
2. **home** + **budget** — 首页核心
3. **expenses** — 核心业务
4. **categories** + **tags** — 分类与限时标签
5. **calendar** — 日历跳转
6. **reports** — 报表图表
7. **filters** — 筛选器
8. **pwa** — PWA 提示（可选，环境相关）

## 与 Git Issue / PR 的关联

若功能来自 GitHub Issue，在 SPEC 的「关联 Issue」字段填写 `#NNN`，便于对照 PR 历史。

## 目录结构

```
workflow/history/
├── README.md                 # 本指南
├── FEATURE-INVENTORY.md      # 功能清单与覆盖状态（主索引）
└── features/
    ├── auth/
    │   ├── SPEC.md           # 追溯验收标准
    │   └── GREEN.md          # legacy-green / full-green
    ├── expenses/
    └── ...

e2e/
├── README.md
├── run.sh
├── lib/helpers.sh
├── scripts/                    # 确定性 E2E 守门脚本
└── scenarios/                  # VERIFY 自然语言说明
```

## AI 补档指令示例

对 AI 说：

> 请为 `workflow/history/features/expenses` 补全追溯 SPEC，并在 `e2e/scenarios/expenses.md` 编写 VERIFY 自然语言步骤。若它属于核心守门路径，再考虑更新 `e2e/scripts/smoke.sh`。

AI 应：读源码 → 更新历史 SPEC → 写自然语言场景 → 必要时更新稳定 smoke → 运行 `pnpm test:e2e` → 更新 FEATURE-INVENTORY。
