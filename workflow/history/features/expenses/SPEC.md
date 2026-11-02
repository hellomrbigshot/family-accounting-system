# SPEC — 验收标准 [追溯]

> 状态：✅ 完成 | source: retroactive + Issue #40 + Issue #3

## 基本信息

| 字段 | 内容 |
|------|------|
| 任务名称 | [追溯] 支出记录 — CRUD、搜索、日期筛选、列表统计笔数、分页与虚拟滚动 |
| 类型 | retroactive / feature |
| 页面 | `/expenses` |
| 关联 Issue | #40（列表统计笔数，2026-06-12）；#3（分页与虚拟滚动，2026-07-15） |

## 验收标准

### AC-1：列表展示

- **Given**：已登录且有支出数据
- **When**：进入 `/expenses`
- **Then**：展示支出列表，金额带千位分隔符；列表标题旁统计徽章格式为「总计: ¥xxx · N 笔」，N 为当前可见记录数

### AC-2：新增支出

- **Given**：用户在支出页
- **When**：通过浮动按钮打开表单，填写分类、金额、日期等并提交
- **Then**：列表出现新记录

### AC-3：编辑 / 删除

- **Given**：列表中存在一条支出
- **When**：编辑或删除该记录
- **Then**：列表相应更新

### AC-4：搜索

- **Given**：存在含「额外支出」或标签的记录
- **When**：在搜索框输入关键词
- **Then**：列表按分类、备注、金额、标签等过滤

### AC-5：日期范围

- **Given**：未启用筛选器
- **When**：选择开始/结束日期
- **Then**：列表仅展示该范围内记录

### AC-6：从日历跳转

- **Given**：从日历页带 `date` query 进入
- **When**：页面加载
- **Then**：日期范围预填为该日，展示对应记录

### AC-7：列表统计笔数同步

基于 `filteredExpenses`（含筛选器、日期查询、搜索等前端可见列表），笔数与总额同步更新：

- **Given**：已登录并进入支出页，当前日期范围内有支出记录  
  **When**：未输入搜索词且未应用筛选器  
  **Then**：统计徽章中 N 等于当前可见支出条数

- **Given**：存在可用筛选器  
  **When**：应用筛选器使列表记录数变化  
  **Then**：N 等于筛选后可见记录数

- **Given**：列表可被搜索过滤  
  **When**：在搜索框输入关键词  
  **Then**：N 等于搜索后可见记录数

- **Given**：当前筛选/搜索条件下无匹配支出  
  **When**：列表为空  
  **Then**：统计徽章显示「总计: ¥0.00 · 0 笔」（或等价零金额格式）

### AC-8：列表分页（#3）

- **Given**：筛选条件下支出笔数超过一页（默认 `pageSize=20`）
- **When**：在支出页列表滚动到底部
- **Then**：追加加载下一页；全部加载完后展示「已显示全部」

- **Given**：请求 `GET /api/expenses` 且携带 `page` / `pageSize`
- **When**：服务端处理完成
- **Then**：返回 `{ list, pagination, summary }`；未传分页参数时仍返回数组（兼容 Home 等调用）

### AC-9：虚拟滚动（#3）

- **Given**：支出页当前查询下有多条记录
- **When**：查看列表 DOM
- **Then**：存在虚拟列表容器，且实际渲染行数显著少于累计数据条数

- **Given**：无搜索词
- **When**：首屏加载完成
- **Then**：统计徽章笔数/金额使用服务端 `summary`（即使尚未加载完全部页）

### AC-10：移动端实际容器滚动（2026-11-02 修复）

- **Given**：支出列表存在多页数据，布局由 `main` 滚动
- **When**：持续向下滚动，再返回顶部
- **Then**：虚拟行随 `main` 更新，触底持续追加，最后一条可见且显示「已显示全部」；无重复页请求，返回顶部首条重新出现，底部导航保持可见。

### AC-11：尺寸变化与重新查询

- **Given**：移动端长列表已经滚动
- **When**：变更到小屏、横屏，或搜索后清空关键词
- **Then**：列表位置与实际滚动容器保持一致，匹配记录可完整浏览，重新查询后仍能分页到末条。

### AC-12：大数据下动态行高稳定性

- **Given**：至少 2,003 条长短备注混合数据（每页 20 条，共 101 页）
- **When**：在手机与小屏尺寸连续滚动至末条，再回顶部；搜索后跳转不同位置
- **Then**：记录无遗漏或重复、末页 3 条、summary 正确；无空白及 ResizeObserver 循环错误，实际渲染保持少量行，测试数据清理完成。

## 技术说明（Issue #40）

- 页面：`frontend/src/views/Expenses.vue`
- `expenseCount = computed(() => filteredExpenses.value.length)`（搜索时）
- 无搜索时：`expensesSummary.count` / `totalAmount`
- 统计徽章：`总计: {{ formatAmount(totalAmount) }} · {{ expenseCount }} 笔`
- 不包含（#40）：报表页统计、E2E bridge、筛选器管理 UI 改造

## 技术说明（Issue #3）

- 后端：`GET /api/expenses` 可选分页；`pageSize` 默认 20、上限 100
- 前端：`@tanstack/vue-virtual` + 列表容器内滚动加载更多
- 首页等未传 `page` 的调用保持数组响应

## 实现记录

| 文件 | 说明 |
|------|------|
| `frontend/src/views/Expenses.vue` | 支出页主逻辑；统计徽章（#40）；分页接线（#3） |
| `frontend/src/components/ExpenseForm.vue` | 新增/编辑表单 |
| `frontend/src/components/ExpenseList.vue` | 列表容器；刷新/加载更多（#3） |
| `frontend/src/components/ExpenseListContent.vue` | 虚拟列表内容（#3） |
| `frontend/src/api/expense.ts` | 分页类型（#3） |
| `frontend/src/stores/expense.ts` | 分页 append / summary（#3） |
| `backend/src/controllers/expense.ts` | 可选分页与合计（#3） |
| `backend/src/routes/expense.ts` | 支出 API |

## 2026-11-02 修复记录

分支：`codex/fix-mobile-list-scroll`，基于最新 `origin/main`。

- 根因：布局使用 `main.overflow-y-auto`，虚拟列表却监听 `window`；滚动 1200px 后 DOM 仍为第 0–10 行。
- `ExpenseListContent.vue`：使用元素虚拟器，查找实际滚动祖先；触底观察器共用该容器；按容器坐标计算偏移，尺寸变化后更新；用记录 ID 作为稳定 key。
- `ExpenseList.vue`：修正虚拟滚动宿主注释。
- `e2e/lib/helpers.sh` / `e2e/scripts/smoke.sh`：新增实际滚动至末条、回到首条、有限渲染、导航可见、重复页请求断言。

## 2026-11-02 大数据验证补充

2,003 条长短备注混合数据暴露动态行高测量中的 ResizeObserver 循环通知错误。`ExpenseListContent.vue` 开启虚拟器动画帧测量，自有尺寸观察也通过动画帧更新并在卸载时取消。
