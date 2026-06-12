# 功能清单与覆盖状态

> 主索引：模块文档与测试覆盖。AC 明细见 [`e2e/TEST-CATALOG.md`](../../e2e/TEST-CATALOG.md)。  
> 更新时同步修改 `workflow/history/features/<id>/` 与 `e2e/scenarios/<id>.md`。

**图例**

- **workflow**：⬜ 未补档 | 📝 SPEC 已写 | ✅ 文档完整（SPEC + full-green）
- **test**：`automated` 有 AC 级断言 | `smoke` 仅入口 | `verify-only` 仅 VERIFY | `none` 未覆盖

| ID | 模块 | 页面/入口 | SPEC | VERIFY 场景 | GREEN | workflow | test |
|----|------|-----------|------|-------------|-------|----------|------|
| auth | 认证 | `/login` | [SPEC](features/auth/SPEC.md) | [auth.md](../../e2e/scenarios/auth.md) | [GREEN](features/auth/GREEN.md) | ✅ | automated |
| home | 首页 | `/` | [SPEC](features/home/SPEC.md) | [home.md](../../e2e/scenarios/home.md) | [GREEN](features/home/GREEN.md) | ✅ | smoke |
| budget | 预算 | 首页弹窗 | [SPEC](features/budget/SPEC.md) | [budget.md](../../e2e/scenarios/budget.md) | [GREEN](features/budget/GREEN.md) | ✅ | smoke + verify-only |
| expenses | 支出 | `/expenses` | [SPEC](features/expenses/SPEC.md) | [expenses.md](../../e2e/scenarios/expenses.md) | [GREEN](features/expenses/GREEN.md) | ✅ | automated + verify-only |
| filters | 筛选器 | 支出页 | [SPEC](features/filters/SPEC.md) | [filters.md](../../e2e/scenarios/filters.md) | [GREEN](features/filters/GREEN.md) | ✅ | verify-only |
| calendar | 日历 | `/calendar` | [SPEC](features/calendar/SPEC.md) | [calendar.md](../../e2e/scenarios/calendar.md) | [GREEN](features/calendar/GREEN.md) | ✅ | smoke |
| categories | 分类 | `/categories` | [SPEC](features/categories/SPEC.md) | [categories.md](../../e2e/scenarios/categories.md) | [GREEN](features/categories/GREEN.md) | ✅ | smoke |
| tags | 标签 | 标签 Tab | [SPEC](features/tags/SPEC.md) | [tags.md](../../e2e/scenarios/tags.md) | [GREEN](features/tags/GREEN.md) | ✅ | smoke |
| reports | 报表 | `/reports` | [SPEC](features/reports/SPEC.md) | [reports.md](../../e2e/scenarios/reports.md) | [GREEN](features/reports/GREEN.md) | ✅ | smoke |
| pwa | PWA | 全局 | [SPEC](features/pwa/SPEC.md) | [pwa.md](../../e2e/scenarios/pwa.md) | [GREEN](features/pwa/GREEN.md) | ✅ | none |

### test 列说明

- **automated**：TEST-CATALOG 中至少一条 AC 有 `auth.sh` / `smoke.sh` 级断言
- **smoke**：仅有页面入口关键字断言
- **verify-only**：复杂交互仅在 VERIFY / `verify-history.sh` 覆盖
- **none**：环境相关，手动 VERIFY

## 运行 E2E

```bash
pnpm test:e2e:install   # 首次
pnpm test:e2e           # auth + smoke（守门）
bash e2e/scripts/verify-history.sh  # 发版前全量 VERIFY
```

## 覆盖目标

- **短期**：TEST-CATALOG 与 smoke/auth 同步；新功能至少 1 条 automated 断言
- **中期**：改复杂模块时按 scenarios 专项 VERIFY
- **长期**：守门保持轻量；filters / PWA 维持 verify-only
