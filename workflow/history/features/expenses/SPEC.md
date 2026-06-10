# SPEC — 验收标准 [追溯]

> 状态：✅ 完成（legacy） | source: retroactive

## 基本信息

| 字段 | 内容 |
|------|------|
| 任务名称 | [追溯] 支出记录 — CRUD、搜索、日期筛选 |
| 类型 | retroactive |
| 页面 | `/expenses` |

## 验收标准

### AC-1：列表展示

- **Given**：已登录且有支出数据
- **When**：进入 `/expenses`
- **Then**：展示支出列表，金额带千位分隔符

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

## 实现记录

| 文件 | 说明 |
|------|------|
| `frontend/src/views/Expenses.vue` | 支出页主逻辑 |
| `frontend/src/components/ExpenseForm.vue` | 新增/编辑表单 |
| `frontend/src/components/ExpenseList.vue` | 列表 |
| `backend/src/routes/expense.ts` | 支出 API |
