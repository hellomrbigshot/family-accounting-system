# GREEN — [追溯] 日历

> 状态：full-green

| 检查项 | 状态 | 备注 |
|--------|------|------|
| 功能已实现 | ✅ | 月份查询、跳转支出列表 |
| 追溯 SPEC | ✅ | [SPEC.md](./SPEC.md) |
| VERIFY 场景 | ✅ | [calendar.md](../../../e2e/scenarios/calendar.md) |
| 稳定 E2E | ✅ | `e2e/scripts/smoke.sh`（日历页段） |
| workflow 文档完整 | ✅ | |

## 稳定 E2E 映射

| AC | 覆盖方式 |
|----|----------|
| AC-1 月份范围查询（入口） | `smoke.sh` 断言「支出日历」 |

## VERIFY-only

| AC | 说明 |
|----|------|
| AC-2 跳转支出列表 | 见 `calendar.md` 点击日期跳转步骤 |

## 结论

- [x] **full-green** — 追溯补档完成
