# 功能清单与覆盖状态

> 主索引：所有已实现功能的追溯文档与 E2E 覆盖进度。  
> 更新此表时同步修改 `workflow/history/features/<id>/` 与 `e2e/scenarios/<id>.md`。只有核心守门路径才同步修改 `e2e/scripts/auth.sh` 或 `e2e/scripts/smoke.sh`。

**图例**：workflow ⬜ 未补档 | 📝 SPEC 已写 | ✅ 文档完整（SPEC + full-green） · e2e ⬜ 未写 | 🔄 部分 / VERIFY-only | ✅ 稳定脚本覆盖

| ID | 模块 | 页面/入口 | 追溯 SPEC | VERIFY 场景 | GREEN | workflow | e2e |
|----|------|-----------|-----------|-------------|-------|----------|-----|
| auth | 认证 | `/login` 退出 | [SPEC](features/auth/SPEC.md) | [auth.md](../../e2e/scenarios/auth.md) | [full-green](features/auth/GREEN.md) | ✅ | ✅ |
| home | 首页 | `/` | [SPEC](features/home/SPEC.md) | [home.md](../../e2e/scenarios/home.md) | [full-green](features/home/GREEN.md) | ✅ | ✅ |
| budget | 预算 | 首页弹窗 | [SPEC](features/budget/SPEC.md) | [budget.md](../../e2e/scenarios/budget.md) | [full-green](features/budget/GREEN.md) | ✅ | 🔄 |
| expenses | 支出 | `/expenses` | [SPEC](features/expenses/SPEC.md) | [expenses.md](../../e2e/scenarios/expenses.md) | [full-green](features/expenses/GREEN.md) | ✅ | ✅ |
| filters | 筛选器 | 支出页 | [SPEC](features/filters/SPEC.md) | [filters.md](../../e2e/scenarios/filters.md) | [full-green](features/filters/GREEN.md) | ✅ | 🔄 |
| calendar | 日历 | `/calendar` | [SPEC](features/calendar/SPEC.md) | [calendar.md](../../e2e/scenarios/calendar.md) | [full-green](features/calendar/GREEN.md) | ✅ | ✅ |
| categories | 分类 | `/categories` | [SPEC](features/categories/SPEC.md) | [categories.md](../../e2e/scenarios/categories.md) | [full-green](features/categories/GREEN.md) | ✅ | ✅ |
| tags | 标签 | 标签 Tab | [SPEC](features/tags/SPEC.md) | [tags.md](../../e2e/scenarios/tags.md) | [full-green](features/tags/GREEN.md) | ✅ | ✅ |
| reports | 报表 | `/reports` | [SPEC](features/reports/SPEC.md) | [reports.md](../../e2e/scenarios/reports.md) | [full-green](features/reports/GREEN.md) | ✅ | ✅ |
| pwa | PWA | 全局 | [SPEC](features/pwa/SPEC.md) | [pwa.md](../../e2e/scenarios/pwa.md) | [full-green](features/pwa/GREEN.md) | ✅ | ⬜ |

### e2e 列说明

- **✅**：`auth.sh` 或 `smoke.sh` 有该模块入口级断言
- **🔄**：仅 VERIFY 场景覆盖（`filters` 永久 VERIFY-only；`budget` 保存逻辑 VERIFY-only；`auth` 注册 VERIFY-only）
- **⬜**：`pwa` 手动 VERIFY，不纳入 `pnpm test:e2e`

## 运行 E2E

```bash
pnpm test:e2e:install   # 首次
pnpm test:e2e           # auth + smoke
pnpm test:e2e auth      # 认证专项
pnpm test:e2e smoke     # 核心入口 smoke
```

## 后端已有、前端未暴露

| 模块 | API 前缀 | 说明 |
|------|----------|------|
| accounts | `/api/accounts` | 暂无独立页面 |
| health | `/api/health` | 无需 E2E |

## 覆盖目标

- **短期**：auth + smoke 稳定；history 全部 full-green 文档
- **中期**：改复杂模块时按 `e2e/scenarios/*.md` 专项 VERIFY
- **长期**：核心守门保持轻量，filters / budget 保存 / PWA 维持 VERIFY-only 策略
