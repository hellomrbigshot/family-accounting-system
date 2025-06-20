# 家庭账本

一个基于 Vue.js 和 Node.js 的全栈家庭账本。

## 功能特点

- 用户认证（OAuth2）
- 收入和支出记录
- 分类管理
- 支付方式管理
- 数据可视化
- 多用户支持

## 技术栈

### 前端
- Vue 3
- TypeScript
- Vant UI
- Pinia
- Vue Router
- Axios

### 后端
- Node.js
- Express
- MongoDB
- TypeScript
- JWT 认证

## 开发环境设置

### 前端
```bash
cd frontend
pnpm install
pnpm dev
```

### 后端
```bash
cd backend
pnpm install
pnpm dev
```

## 环境变量

### 前端 (.env)
```
VITE_API_BASE_URL=http://localhost:3000/api
```

### 后端 (.env)
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/family-accounting
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=15d
PASSWORD_SALT_ROUNDS=10
```

## 默认账号

- 房间号：888888
- 密码：123456

## 许可证

MIT 