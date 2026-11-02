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
| AC-8 分页 / AC-10 移动端容器滚动 | `smoke.sh`：`ab_assert_expense_scroll`，末条可见、返回首条、有限渲染、底部导航、无重复分页 |

## verify-only

| AC | 说明 |
|----|------|
| AC-2 新增支出 | [expenses.md](../../../e2e/scenarios/expenses.md) |
| AC-3 编辑 / 删除 | 左滑等复杂交互 |
| AC-4 搜索 | [expenses.md](../../../e2e/scenarios/expenses.md) 步骤 8 |
| AC-5 日期范围 | [expenses.md](../../../e2e/scenarios/expenses.md) |
| AC-6 日历跳转 | [calendar.md](../../../e2e/scenarios/calendar.md) |
| AC-11 尺寸变化与重新查询 | agent-browser：320×568、740×360、搜索与清空后完整滚动 |

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

## 2026-11-02 移动端滚动修复交付

- 分支：`codex/fix-mobile-list-scroll`（基于 `origin/main`）。
- VERIFY：iPhone 15 模拟，44 条真实现有记录，20/20/4 分页；修复前滚动 1200px 后仍渲染 0–10 行，修复后可滚到索引 43、显示「已显示全部」，回顶部索引 0 可见。320×568 与 740×360 通过；搜索 E2E 得 8 条，清空后 44 条均可完整滚动。浏览器无错误。
- TEST：`pnpm build`、`pnpm test:e2e`（auth + smoke，含新增滚动断言）通过；补充重复页请求断言后独立运行该断言通过。`git diff --check`、shell 语法检查通过。
- 截图：本地忽略目录 `e2e/artifacts/mobile-scroll-top.png`。
- 限制：设备模拟验证，未使用实体手机；自动化使用测试库现有数据，无数据时跳过滚动，多页路径需 >20 条。
- AC 映射：本次任务 AC-1/AC-2 对应模块 AC-8/AC-10（automated），本次 AC-3 对应模块 AC-11（verify-only，尺寸与搜索组合）。

## 2026-11-02 大数据回归补充（AC-12）

- 2,003 条真实 API 数据，隔离房间，长短备注混合。393×852 / 320×568 各完整遍历 101 页，尾页 3 条；ID 无遗漏或重复，summary 一致，最多渲染 21/18 行；无空白与浏览器错误，可回首条，底部导航可见。
- 暴露并修复 ResizeObserver 循环通知错误：测量及尺寸观察更新调度到动画帧。
- 横屏、搜索全部 2,003 条的五个位置跳转、清空后恢复分页通过；临时数据与房间已清理。
- AC-12：verify-only，详见 `e2e/scenarios/expenses.md` 大数据动态行高回归；证据见 `workflow/history/VERIFY-LOG.md`，本地明细 `e2e/artifacts/large-list-report.md`。

大数据修正后 `pnpm build`、完整 `pnpm test:e2e`（auth + smoke）再次通过；现有测试房间仍为 44 笔。

发布前 `bash e2e/scripts/verify-history.sh`：29 项通过、0 失败、0 跳过；2 项条件项为当月未超预算及加载过快未捕获骨架屏，详见 VERIFY-LOG。
