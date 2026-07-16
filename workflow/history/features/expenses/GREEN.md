# GREEN — [追溯] 支出

> 状态：full-green（文档完整；automated 覆盖见 TEST-CATALOG）

| 检查项 | 状态 | 备注 |
|--------|------|------|
| 功能已实现 | ✅ | 列表、增删改、搜索、日期、日历跳转、统计笔数（#40）、分页与虚拟滚动（#3） |
| 追溯 SPEC | ✅ | [SPEC.md](./SPEC.md) |
| VERIFY 场景 | ✅ | [expenses.md](../../../e2e/scenarios/expenses.md) |
| TEST 映射 | ✅ | [TEST-CATALOG.md](../../../e2e/TEST-CATALOG.md) expenses 段 |
| workflow 文档完整 | ✅ | Issue #40 / #3 已并入本目录 |

## automated（pnpm test:e2e）

| AC | 覆盖方式 |
|----|----------|
| AC-1 列表入口 | `smoke.sh`：「支出记录」 |
| AC-7 统计笔数 (#40) | `smoke.sh`：`ab_assert_expense_stats_badge` |
| AC-9 虚拟滚动 (#3) | `smoke.sh`：`ab_assert_expense_virtual_list` |

## verify-only

| AC | 说明 |
|----|------|
| AC-2 新增支出 | [expenses.md](../../../e2e/scenarios/expenses.md) |
| AC-3 编辑 / 删除 | 左滑等复杂交互 |
| AC-4 搜索 | [expenses.md](../../../e2e/scenarios/expenses.md) 步骤 8 |
| AC-5 日期范围 | [expenses.md](../../../e2e/scenarios/expenses.md) |
| AC-6 日历跳转 | [calendar.md](../../../e2e/scenarios/calendar.md) |
| AC-8 列表分页 (#3) | [expenses.md](../../../e2e/scenarios/expenses.md) 步骤 15–16（依赖大量数据翻页） |

## Issue #40 交付记录

| 字段 | 内容 |
|------|------|
| 完成日期 | 2026-06-12 |
| 分支 | `feat/issue-40` |
| VERIFY | [VERIFY-LOG.md](../../VERIFY-LOG.md) Issue #40 |
| TEST | `smoke.sh` AC-7 断言 + `pnpm test:e2e` pass |

## Issue #3 交付记录

| 字段 | 内容 |
|------|------|
| 完成日期 | 2026-07-15 |
| 分支 | `feat/issue-3` |
| VERIFY | agent-browser：宽日期范围下徽章=44 笔、虚拟行约 12、滚动后「已显示全部」 |
| TEST | `smoke.sh` AC-9 + `pnpm test:e2e` pass |

## 结论

- **GREEN**：支出模块文档与自动化守门完整；可随 Issue #3 PR 交付。
