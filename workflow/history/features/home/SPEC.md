# SPEC — 验收标准 [追溯]

> 状态：✅ 完成（legacy） | source: retroactive

## 基本信息

| 字段 | 内容 |
|------|------|
| 任务名称 | [追溯] 首页 — 本月总览与最近支出 |
| 类型 | retroactive |
| 页面 | `/` |

## 验收标准

### AC-1：本月总览

- **Given**：已登录用户进入首页
- **When**：页面加载完成
- **Then**：展示本月预算、已支出金额、进度条与使用百分比

### AC-2：超预算展示

- **Given**：本月支出超过预算
- **When**：查看总览卡片
- **Then**：支出金额与进度条呈红色警示样式

### AC-3：最近支出

- **Given**：存在历史支出
- **When**：查看「最近支出」区域
- **Then**：展示最近记录列表；可点击「查看全部」跳转 `/expenses`

### AC-4：快捷入口

- **Given**：用户在首页
- **When**：点击「分类管理」
- **Then**：跳转 `/categories`

## 实现记录

| 文件 | 说明 |
|------|------|
| `frontend/src/views/Home.vue` | 首页布局与数据 |
| `frontend/src/components/ExpenseList.vue` | 最近支出列表 |
