# GREEN — [追溯] 支出

> 状态：full-green

| 检查项 | 状态 | 备注 |
|--------|------|------|
| 功能已实现 | ✅ | 列表、增删改、搜索、日期、日历跳转、统计笔数（#40） |
| 追溯 SPEC | ✅ | [SPEC.md](./SPEC.md) |
| VERIFY 场景 | ✅ | [expenses.md](../../../e2e/scenarios/expenses.md) |
| 稳定 E2E | ✅ | `e2e/scripts/smoke.sh`（支出页段） |
| workflow 文档完整 | ✅ | Issue #40 已并入本目录 SPEC / GREEN |

## 稳定 E2E 映射

| AC | 覆盖方式 |
|----|----------|
| AC-1 列表展示（入口） | `smoke.sh` 断言「支出记录」 |

## VERIFY-only

| AC | 说明 |
|----|------|
| AC-7 统计笔数 | `expenses.md` 步骤 3–4；详见 [VERIFY-LOG.md](../../VERIFY-LOG.md) Issue #40 |
| AC-2 新增支出 | 见 `expenses.md` |
| AC-3 编辑 / 删除 | 见 `expenses.md`（左滑等复杂交互） |
| AC-4 搜索 | 见 `expenses.md` |
| AC-5 日期范围 | 见 `expenses.md` |
| AC-6 从日历跳转 | 见 `expenses.md` / `calendar.md` |

## Issue #40 交付记录

| 字段 | 内容 |
|------|------|
| 完成日期 | 2026-06-12 |
| 分支 | `feat/issue-40` |
| VERIFY | cursor-ide-browser（默认 8 笔、搜索 1 笔、筛选 0 笔） |
| TEST | `pnpm test:e2e` pass |

## 结论

- [x] **full-green** — 追溯补档完成；#40 已合并为模块单一文档源
