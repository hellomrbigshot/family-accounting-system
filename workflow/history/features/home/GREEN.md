# GREEN — [追溯] 首页

> 状态：full-green

| 检查项 | 状态 | 备注 |
|--------|------|------|
| 功能已实现 | ✅ | 本月总览、最近支出、快捷入口 |
| 追溯 SPEC | ✅ | [SPEC.md](./SPEC.md) |
| VERIFY 场景 | ✅ | [home.md](../../../e2e/scenarios/home.md) |
| 稳定 E2E | ✅ | `e2e/scripts/smoke.sh`（首页段） |
| workflow 文档完整 | ✅ | |

## 稳定 E2E 映射

| AC | 覆盖方式 |
|----|----------|
| AC-1 本月总览 | `smoke.sh` 断言「本月总览」 |
| AC-3 最近支出 | `smoke.sh` 断言「最近支出」 |

## VERIFY-only

| AC | 说明 |
|----|------|
| AC-2 超预算展示 | 依赖当月数据状态，见 `home.md` 条件断言 |
| AC-4 快捷入口 | 见 `home.md` 分类管理跳转步骤 |

## 结论

- [x] **full-green** — 追溯补档完成
