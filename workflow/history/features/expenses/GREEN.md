# GREEN — [追溯] 支出

> 状态：full-green

| 检查项 | 状态 | 备注 |
|--------|------|------|
| 功能已实现 | ✅ | 列表、增删改、搜索、日期、日历跳转 |
| 追溯 SPEC | ✅ | [SPEC.md](./SPEC.md) |
| VERIFY 场景 | ✅ | [expenses.md](../../../e2e/scenarios/expenses.md) |
| 稳定 E2E | ✅ | `e2e/scripts/smoke.sh`（支出页段） |
| workflow 文档完整 | ✅ | |

## 稳定 E2E 映射

| AC | 覆盖方式 |
|----|----------|
| AC-1 列表展示（入口） | `smoke.sh` 断言「支出记录」 |

## VERIFY-only

| AC | 说明 |
|----|------|
| AC-2 新增支出 | 见 `expenses.md` |
| AC-3 编辑 / 删除 | 见 `expenses.md`（左滑等复杂交互） |
| AC-4 搜索 | 见 `expenses.md` |
| AC-5 日期范围 | 见 `expenses.md` |
| AC-6 从日历跳转 | 见 `expenses.md` / `calendar.md` |

## 结论

- [x] **full-green** — 追溯补档完成
