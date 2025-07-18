# 用户模块 API 文档

## 模块概述

用户模块提供用户管理功能，包括用户注册、登录和获取用户信息。

## 接口列表

### 1. 用户注册

**接口地址**: `POST /api/users/register`

**请求方式**: POST

**请求头**:
```
Content-Type: application/json
```

**请求参数**:
```json
{
  "roomNumber": "888888",
  "password": "123456"
}
```

**参数说明**:
- `roomNumber` (string, 必填): 房间号（唯一）
- `password` (string, 必填): 密码

**成功响应** (201):
```json
{
  "message": "注册成功",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**错误响应** (400):
```json
{
  "message": "房间号已存在"
}
```

### 2. 用户登录

**接口地址**: `POST /api/users/login`

**请求方式**: POST

**请求头**:
```
Content-Type: application/json
```

**请求参数**:
```json
{
  "roomNumber": "888888",
  "password": "123456"
}
```

**参数说明**:
- `roomNumber` (string, 必填): 房间号
- `password` (string, 必填): 密码

**成功响应** (200):
```json
{
  "message": "登录成功",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**错误响应** (401):
```json
{
  "message": "房间号或密码错误"
}
```

### 3. 获取用户信息

**接口地址**: `GET /api/users/info`

**请求方式**: GET

**请求头**:
```
Authorization: Bearer <your_jwt_token>
```

**成功响应** (200):
```json
{
  "roomNumber": "888888",
  "createdAt": "2024-12-19T10:30:00.000Z",
  "updatedAt": "2024-12-19T10:30:00.000Z"
}
```

**错误响应** (401):
```json
{
  "message": "未授权"
}
```

## 数据模型

### 用户结构
```typescript
interface User {
  roomNumber: string;
  password: string; // 数据库中存储的是哈希值
  createdAt: Date;
  updatedAt: Date;
}
```

## 认证说明

1. **JWT Token**: 登录成功后返回 JWT token，用于后续接口认证
2. **密码加密**: 使用 bcrypt 对密码进行哈希存储
3. **房间号唯一性**: 每个房间号只能注册一次
4. **Token 有效期**: JWT token 有效期为 15 天

## 错误码说明

| 状态码 | 说明 |
|--------|------|
| 200 | 登录成功 |
| 201 | 注册成功 |
| 400 | 请求参数错误或房间号已存在 |
| 401 | 认证失败或未授权 |
| 500 | 服务器内部错误 |

## 示例代码

### 用户注册
```javascript
const registerData = {
  roomNumber: "888888",
  password: "123456"
};

fetch('/api/users/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(registerData)
})
.then(response => response.json())
.then(data => {
  console.log('注册成功:', data);
  // 保存 token 到 localStorage
  localStorage.setItem('token', data.token);
});
```

### 用户登录
```javascript
const loginData = {
  roomNumber: "888888",
  password: "123456"
};

fetch('/api/users/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(loginData)
})
.then(response => response.json())
.then(data => {
  console.log('登录成功:', data);
  // 保存 token 到 localStorage
  localStorage.setItem('token', data.token);
});
```

### 获取用户信息
```javascript
fetch('/api/users/info', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
})
.then(response => response.json())
.then(data => {
  console.log('用户信息:', data);
});
```

## 安全建议

1. **密码强度**: 建议使用包含字母、数字和特殊字符的强密码
2. **Token 管理**: 定期更换 token，不要在客户端存储敏感信息
3. **房间号管理**: 妥善保管房间号，避免泄露给他人
4. **定期检查**: 定期检查账户安全状态 