# 历史功能 VERIFY 记录

| 字段 | 内容 |
|------|------|
| 执行时间 | 2026-06-10 13:59:10 +0800 |
| 工具 | agent-browser + DEV E2E bridge |
| 脚本 | `e2e/scripts/verify-history.sh` |

## 汇总

- 通过：**29**
- 失败：**0**
- 跳过：**0**
- 条件/部分：**2**

### 通过
- auth AC-2 错误密码停留登录页
- auth AC-3 注册成功
- auth AC-1 登录成功
- home AC-1 本月总览
- home AC-3 最近支出
- home AC-4 快捷入口
- budget AC-1 打开预算弹窗
- budget AC-2 保存预算
- expenses AC-1 列表入口
- expenses AC-2 新增支出
- expenses AC-4 搜索
- expenses AC-5/6 日期 query
- expenses AC-3 编辑
- expenses AC-3 删除
- filters AC-1 创建筛选器
- filters AC-2 应用筛选器
- filters AC-3 清除筛选
- calendar AC-1 日历页
- calendar AC-2 跳转支出列表
- categories AC-2 新建
- categories AC-2 编辑
- categories AC-2 删除
- tags AC-1 普通标签
- tags AC-2 限时标签
- tags AC-3 归档标签
- reports AC-2 图表/统计区域
- pwa AC-1 安装提示
- pwa AC-2 更新提示
- auth AC-4 退出登录

### 条件/部分
- home AC-2 超预算展示（当月未超预算，条件未满足）
- reports AC-3 加载态（加载过快，未捕获骨架屏）

## 说明

- 复杂流程通过 `window.__FAS_E2E__`（仅 DEV，handler 见 `frontend/src/e2e/handlers.ts`）走 store/API。
- 原 9 项跳过 AC 已纳入本脚本。

## Issue #40（2026-06-12）

| 字段 | 内容 |
|------|------|
| 工具 | cursor-ide-browser + CDP |
| 文档 | [expenses/SPEC.md](features/expenses/SPEC.md) · [expenses/GREEN.md](features/expenses/GREEN.md) |
| TEST | `pnpm test:e2e` pass |

### 通过
- expenses AC-7 默认列表显示笔数（`总计: ¥82.27 · 8 笔`）
- expenses AC-7 搜索后笔数同步（`E2E限时` → 1 笔）
- expenses AC-7 筛选器应用后笔数同步（「大额支出」→ 0 笔）

## 2026-11-02：移动端支出长列表滚动

分支 `codex/fix-mobile-list-scroll`。agent-browser iPhone 15，现有 44 条记录：
修复前 main.scrollTop=1200，虚拟行仍停在 0–10；修复后监听实际 main，末条索引 43 可见并显示「已显示全部」，回顶部恢复首条。底部导航 bottom=852 与视口一致，window.scrollY=0。
320×568 与 740×360 均可滚到末条并回顶。搜索 E2E 得 8 条可完整滚动，清空后恢复 44 条分页。无浏览器错误；截图 `e2e/artifacts/mobile-scroll-top.png`（忽略目录）。
`pnpm build`、`pnpm test:e2e` 通过；新增滚动断言在现有数据上通过，包括无重复页请求检查。

## 2026-11-02：2,003 条真实数据大规模回归（AC-12）

独立临时房间通过真实 API 创建 2,003 条长短备注混合支出，各 12.50。agent-browser 使用真实登录页，未使用 mock/bridge。393×852 连续滚动 400 步、320×568 连续滚动 622 步，均捕获第 1–101 页，2,003 个唯一 ID，无缺页/重复页/重复记录，尾页 3 条，summary 始终为 2,003 笔 / 25,037.50。最大 DOM 行数分别 21/18，无可见空白；末条、返回首条、底部导航均通过。

初次大数据运行捕获 ResizeObserver 循环通知错误；已将虚拟器测量及自有尺寸观察更新调度到动画帧，再完整重跑后两种尺寸错误数均为 0。横屏 740×360 末条、搜索 2,003 条后五个位置跳转、清空恢复第 1 页 20 条均通过。

finally 清理全部 2,003 条支出和测试房间。报告/JSON/截图/临时脚本保存在忽略目录 `e2e/artifacts/large-list-*`。浏览器模拟验证，无实体设备或 FPS 测量。

## 2026-11-02 发版前历史功能验证

### 全量历史功能验证

| 字段 | 内容 |
|------|------|
| 执行时间 | 2026-11-02 20:07:07 +0800 |
| 工具 | agent-browser + DEV E2E bridge |
| 脚本 | `e2e/scripts/verify-history.sh` |

## 汇总

- 通过：**29**
- 失败：**0**
- 跳过：**0**
- 条件/部分：**2**

### 通过
- auth AC-2 错误密码停留登录页
- auth AC-3 注册成功
- auth AC-1 登录成功
- home AC-1 本月总览
- home AC-3 最近支出
- home AC-4 快捷入口
- budget AC-1 打开预算弹窗
- budget AC-2 保存预算
- expenses AC-1 列表入口
- expenses AC-2 新增支出
- expenses AC-4 搜索
- expenses AC-5/6 日期 query
- expenses AC-3 编辑
- expenses AC-3 删除
- filters AC-1 创建筛选器
- filters AC-2 应用筛选器
- filters AC-3 清除筛选
- calendar AC-1 日历页
- calendar AC-2 跳转支出列表
- categories AC-2 新建
- categories AC-2 编辑
- categories AC-2 删除
- tags AC-1 普通标签
- tags AC-2 限时标签
- tags AC-3 归档标签
- reports AC-2 图表/统计区域
- pwa AC-1 安装提示
- pwa AC-2 更新提示
- auth AC-4 退出登录

### 条件/部分
- home AC-2 超预算展示（当月未超预算，条件未满足）
- reports AC-3 加载态（加载过快，未捕获骨架屏）

## 说明

- 复杂流程通过 `window.__FAS_E2E__`（仅 DEV，handler 见 `frontend/src/e2e/handlers.ts`）走 store/API。
- 原 9 项跳过 AC 已纳入本脚本。
