# GREEN — [追溯] 预算

> 状态：full-green

| 检查项 | 状态 | 备注 |
|--------|------|------|
| 功能已实现 | ✅ | 首页预算弹窗 |
| 追溯 SPEC | ✅ | [SPEC.md](./SPEC.md) |
| VERIFY 场景 | ✅ | [budget.md](../../../e2e/scenarios/budget.md) |
| 稳定 E2E | 🔄 | `smoke.sh` 仅覆盖入口 |
| workflow 文档完整 | ✅ | |

## 稳定 E2E 映射

| AC | 覆盖方式 |
|----|----------|
| AC-1 打开预算弹窗 | `smoke.sh` 点击「设置预算」并断言「预算金额」 |

## VERIFY-only

| AC | 说明 |
|----|------|
| AC-2 保存预算 | 涉及表单填写与持久化，见 `budget.md` 完整场景 |

## 结论

- [x] **full-green** — 追溯补档完成（入口 smoke + 保存 VERIFY-only）
