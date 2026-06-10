# GREEN — [追溯] 报表

> 状态：full-green

| 检查项 | 状态 | 备注 |
|--------|------|------|
| 功能已实现 | ✅ | 日期查询、图表、加载态 |
| 追溯 SPEC | ✅ | [SPEC.md](./SPEC.md) |
| VERIFY 场景 | ✅ | [reports.md](../../../e2e/scenarios/reports.md) |
| 稳定 E2E | ✅ | `e2e/scripts/smoke.sh`（报表页段） |
| workflow 文档完整 | ✅ | |

## 稳定 E2E 映射

| AC | 覆盖方式 |
|----|----------|
| AC-1 日期查询（入口） | `smoke.sh` 断言「支出分析」 |

## VERIFY-only

| AC | 说明 |
|----|------|
| AC-2 图表 | 见 `reports.md` |
| AC-3 加载态 | 见 `reports.md` |

## 结论

- [x] **full-green** — 追溯补档完成
