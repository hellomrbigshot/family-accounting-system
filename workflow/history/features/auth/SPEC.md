# SPEC — 验收标准 [追溯]

> 状态：✅ 完成（legacy） | source: retroactive

## 基本信息

| 字段 | 内容 |
|------|------|
| 任务名称 | [追溯] 用户认证（登录 / 注册 / 退出） |
| 类型 | retroactive |
| 关联 Issue | — |
| 页面 | `/login` `/register` |

## 验收标准

### AC-1：登录

- **Given**：未登录用户访问需认证页面
- **When**：在 `/login` 输入有效房间号与密码并提交
- **Then**：获得 JWT，跳转首页 `/`，底部 Tab 可见

### AC-2：登录失败

- **Given**：用户在登录页
- **When**：输入错误密码
- **Then**：停留登录页，展示错误提示

### AC-3：注册

- **Given**：用户在 `/register`
- **When**：填写新房间号、密码并提交
- **Then**：注册成功并进入已登录状态

### AC-4：退出

- **Given**：已登录用户在「更多」页
- **When**：点击退出并确认
- **Then**：清除登录态，跳转 `/login`

## 实现记录

| 文件 | 说明 |
|------|------|
| `frontend/src/views/Login.vue` | 登录表单 |
| `frontend/src/views/Register.vue` | 注册表单 |
| `frontend/src/stores/auth.ts` | 认证状态 |
| `backend/src/routes/auth.ts` | 登录/注册 API |
