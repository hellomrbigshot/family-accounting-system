# TEST 目录 — AC 与自动化映射

> 主索引：每条验收标准（AC）的 VERIFY 场景、TEST 断言、覆盖类型。  
> 更新时机：新功能 GREEN 前必须更新本表；同步修改 `e2e/scripts/*.sh` 与 `workflow/history/features/<模块>/GREEN.md`。

**覆盖类型**

| 类型 | 含义 |
|------|------|
| **automated** | `pnpm test:e2e` 守门脚本中有对应断言 |
| **smoke** | 仅入口级断言（页面可达、关键字存在） |
| **verify-only** | 仅在 VERIFY 阶段按 `e2e/scenarios/*.md` 探索验证，需写明原因 |

AC 定义以 `workflow/history/features/<模块>/SPEC.md` 为准；本表只记录测试映射。

---

## auth

| AC | VERIFY | TEST 断言 | 类型 |
|----|--------|-----------|------|
| AC-1 登录成功 | [auth.md](scenarios/auth.md) 步骤 2–3 | `auth.sh`：登录后「本月总览」「最近支出」 | automated |
| AC-2 登录失败 | [auth.md](scenarios/auth.md) 步骤 6–7 | `auth.sh`：错误密码停留 `/login` | automated |
| AC-3 注册 | [auth.md](scenarios/auth.md) 注册说明 | — | verify-only（避免重复创建账号） |
| AC-4 退出登录 | [auth.md](scenarios/auth.md) 步骤 4–5 | `auth.sh`：`ab_logout` | automated |

## home

| AC | VERIFY | TEST 断言 | 类型 |
|----|--------|-----------|------|
| AC-1 本月总览 | [home.md](scenarios/home.md) 步骤 3 | `smoke.sh`：「本月总览」 | smoke |
| AC-2 超预算展示 | [home.md](scenarios/home.md) 步骤 7 | — | verify-only（依赖当月数据） |
| AC-3 最近支出 | [home.md](scenarios/home.md) 步骤 4 | `smoke.sh`：「最近支出」 | smoke |
| AC-4 快捷入口 | [home.md](scenarios/home.md) 步骤 5–6 | — | verify-only |

## budget

| AC | VERIFY | TEST 断言 | 类型 |
|----|--------|-----------|------|
| AC-1 打开预算弹窗 | [budget.md](scenarios/budget.md) | `smoke.sh`：点击「设置预算」+「预算金额」 | smoke |
| AC-2 保存预算 | [budget.md](scenarios/budget.md) | — | verify-only（表单交互） |

## expenses

| AC | VERIFY | TEST 断言 | 类型 |
|----|--------|-----------|------|
| AC-1 列表展示 | [expenses.md](scenarios/expenses.md) 步骤 2–3 | `smoke.sh`：「支出记录」 | smoke |
| AC-2 新增支出 | [expenses.md](scenarios/expenses.md) 步骤 5–7 | — | verify-only（Vant 表单/数字键盘） |
| AC-3 编辑 / 删除 | [expenses.md](scenarios/expenses.md) 步骤 11–14 | — | verify-only（左滑删除） |
| AC-4 搜索 | [expenses.md](scenarios/expenses.md) 步骤 8 | — | verify-only |
| AC-5 日期范围 | [expenses.md](scenarios/expenses.md) 步骤 9 | — | verify-only |
| AC-6 日历跳转 | [expenses.md](scenarios/expenses.md) 步骤 10 · [calendar.md](scenarios/calendar.md) | — | verify-only |
| AC-7 统计笔数 (#40) | [expenses.md](scenarios/expenses.md) 步骤 3–4 | `smoke.sh`：`ab_assert_expense_stats_badge` | **automated** |

## filters

| AC | VERIFY | TEST 断言 | 类型 |
|----|--------|-----------|------|
| AC-1 管理筛选器 | [filters.md](scenarios/filters.md) 步骤 3–5 | — | verify-only（永久） |
| AC-2 应用筛选器 | [filters.md](scenarios/filters.md) 步骤 6–7 | — | verify-only |
| AC-3 清除筛选 | [filters.md](scenarios/filters.md) 步骤 8–9 | — | verify-only |

## calendar

| AC | VERIFY | TEST 断言 | 类型 |
|----|--------|-----------|------|
| AC-1 日历页 | [calendar.md](scenarios/calendar.md) | `smoke.sh`：「支出日历」 | smoke |
| AC-2 跳转支出列表 | [calendar.md](scenarios/calendar.md) | — | verify-only |

## categories

| AC | VERIFY | TEST 断言 | 类型 |
|----|--------|-----------|------|
| AC-1 分类列表 | [categories.md](scenarios/categories.md) | `smoke.sh`：「分类管理」 | smoke |
| AC-2 CRUD | [categories.md](scenarios/categories.md) | — | verify-only |

## tags

| AC | VERIFY | TEST 断言 | 类型 |
|----|--------|-----------|------|
| AC-1 普通标签 | [tags.md](scenarios/tags.md) | `smoke.sh`：「标签管理」 | smoke |
| AC-2 限时标签 | [tags.md](scenarios/tags.md) | — | verify-only |
| AC-3 归档标签 | [tags.md](scenarios/tags.md) | — | verify-only |

## reports

| AC | VERIFY | TEST 断言 | 类型 |
|----|--------|-----------|------|
| AC-1 报表入口 | [reports.md](scenarios/reports.md) | `smoke.sh`：「支出分析」 | smoke |
| AC-2 图表 / 统计 | [reports.md](scenarios/reports.md) | — | verify-only |
| AC-3 加载态 | [reports.md](scenarios/reports.md) | — | verify-only |

## pwa

| AC | VERIFY | TEST 断言 | 类型 |
|----|--------|-----------|------|
| AC-1 安装提示 | [pwa.md](scenarios/pwa.md) | — | verify-only（环境相关） |
| AC-2 更新提示 | [pwa.md](scenarios/pwa.md) | — | verify-only |

---

## 新功能 TEST 要求（方案 A）

每个 Issue / 新 AC 在 GREEN 前必须满足 **至少一条**：

1. 在 `e2e/scripts/smoke.sh` 或 `auth.sh` 增加 **1～2 条与本 AC 相关的确定性断言**；或
2. 新增 `e2e/scripts/<模块>-issue-<N>.sh`，并在本表登记；或
3. 明确标注 **verify-only** 并写清原因（不得默认全部 verify-only）。

完成后更新：`TEST-CATALOG.md` → 模块 `GREEN.md` → `workflow/current/TEST.md`。

## 运行策略

| 时机 | 命令 |
|------|------|
| 单功能完成 | `pnpm test:e2e`（auth + smoke） |
| 发版前 | `pnpm test:e2e` + `bash e2e/scripts/verify-history.sh` |
| 大重构 | 同上 |

CI 不跑 E2E；本地 / 发版前执行。
