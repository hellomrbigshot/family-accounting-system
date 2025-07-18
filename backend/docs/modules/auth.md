# 认证模块 API 文档

## 模块概述

认证模块提供用户登录、注册和获取用户信息的功能。使用 JWT 进行身份验证，支持密码加密传输。

## 接口列表

### 1. 用户登录

**接口地址**: `POST /api/auth/login`

**请求方式**: POST

**请求头**:
```
Content-Type: application/json
```

**请求参数**:
```json
{
  "roomNumber": "888888",
  "password": "encrypted_password",
  "timestamp": 1640995200000,
  "nonce": "random_nonce_string"
}
```

**参数说明**:
- `roomNumber` (string, 必填): 房间号
- `password` (string, 必填): 加密后的密码
- `timestamp` (number, 必填): 时间戳（用于验证请求有效期）
- `nonce` (string, 必填): 随机字符串（用于加密）

**成功响应** (200):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**错误响应** (400/401):
```json
{
  "message": "房间号或密码错误"
}
```

### 2. 用户注册

**接口地址**: `POST /api/auth/register`

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
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**错误响应** (400):
```json
{
  "message": "房间号已存在"
}
```

### 3. 获取用户信息

**接口地址**: `GET /api/auth/user`

**请求方式**: GET

**请求头**:
```
Authorization: Bearer <your_jwt_token>
```

**成功响应** (200):
```json
{
  "roomNumber": "888888",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**错误响应** (401):
```json
{
  "message": "未授权"
}
```

## 安全说明

1. **密码加密**: 前端使用 AES 加密传输密码，后端解密验证
2. **时间戳验证**: 请求必须在 5 分钟内有效
3. **JWT 认证**: 登录成功后返回 JWT token，用于后续接口认证
4. **密码哈希**: 数据库中存储的是 bcrypt 哈希后的密码

## 错误码说明

| 状态码 | 说明 |
|--------|------|
| 200 | 登录成功 |
| 201 | 注册成功 |
| 400 | 请求参数错误或房间号已存在 |
| 401 | 认证失败或未授权 |
| 500 | 服务器内部错误 |

## 示例代码

### JavaScript 登录示例
```javascript
const loginData = {
  roomNumber: "888888",
  password: "encrypted_password",
  timestamp: Date.now(),
  nonce: "random_string"
};

fetch('/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(loginData)
})
.then(response => response.json())
.then(data => {
  console.log('登录成功:', data.token);
  // 保存 token 到 localStorage
  localStorage.setItem('token', data.token);
});
```

### 获取用户信息示例
```javascript
fetch('/api/auth/user', {
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