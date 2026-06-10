# GREEN — [追溯] 筛选器

> 状态：full-green

| 检查项 | 状态 | 备注 |
|--------|------|------|
| 功能已实现 | ✅ | 管理 / 应用 / 清除筛选器 |
| 追溯 SPEC | ✅ | [SPEC.md](./SPEC.md) |
| VERIFY 场景 | ✅ | [filters.md](../../../e2e/scenarios/filters.md) |
| 稳定 E2E | 🔄 | **永久 VERIFY-only**，不纳入 `auth.sh` / `smoke.sh` |
| workflow 文档完整 | ✅ | |

## 稳定 E2E 映射

| AC | 覆盖方式 |
|----|----------|
| — | `smoke.sh` 仅间接覆盖支出页入口（「支出记录」），不测筛选器逻辑 |

## VERIFY-only（永久）

| AC | 说明 |
|----|------|
| AC-1 管理筛选器 | 见 `filters.md`（创建 / 编辑 / 删除，依赖分类标签数据） |
| AC-2 应用筛选器 | 见 `filters.md` |
| AC-3 清除筛选 | 见 `filters.md` |

改筛选器相关代码时，按 `filters.md` 专项 VERIFY；不加入稳定守门脚本，避免 flaky 与测试数据污染。

## 结论

- [x] **full-green** — 追溯补档完成（永久 VERIFY-only）
