# SPEC — 验收标准 [追溯]

> 状态：✅ 完成（legacy） | source: retroactive

## 基本信息

| 字段 | 内容 |
|------|------|
| 任务名称 | [追溯] 月度预算设置 |
| 类型 | retroactive |
| 入口 | 首页「设置预算」按钮 → `BudgetDialog` |

## 验收标准

### AC-1：打开预算弹窗

- **Given**：用户在首页
- **When**：点击「设置预算」
- **Then**：弹出预算设置对话框，展示当前预算（若有）

### AC-2：保存预算

- **Given**：预算弹窗已打开
- **When**：输入有效金额并保存
- **Then**：弹窗关闭，首页总览预算金额更新

## 实现记录

| 文件 | 说明 |
|------|------|
| `frontend/src/components/BudgetDialog.vue` | 预算弹窗 |
| `frontend/src/stores/budget.ts` | 预算状态 |
| `backend/src/routes/budget.ts` | 预算 API |
