# SPEC — 验收标准 [追溯]

> 状态：✅ 完成 | source: retroactive + Issue #40

## 基本信息

| 字段 | 内容 |
|------|------|
| 任务名称 | [追溯] 支出记录 — CRUD、搜索、日期筛选、列表统计笔数 |
| 类型 | retroactive / feature |
| 页面 | `/expenses` |
| 关联 Issue | #40（列表统计笔数，2026-06-12） |

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

## 技术说明（Issue #40）

- 页面：`frontend/src/views/Expenses.vue`
- `expenseCount = computed(() => filteredExpenses.value.length)`
- 统计徽章：`总计: {{ formatAmount(totalAmount) }} · {{ expenseCount }} 笔`
- 不包含：后端 API、报表页统计、E2E bridge、筛选器管理 UI 改造

## 实现记录

| 文件 | 说明 |
|------|------|
| `frontend/src/views/Expenses.vue` | 支出页主逻辑；`expenseCount` 与统计徽章（#40） |
| `frontend/src/components/ExpenseForm.vue` | 新增/编辑表单 |
| `frontend/src/components/ExpenseList.vue` | 列表 |
| `backend/src/routes/expense.ts` | 支出 API |
