# 账户模块 API 文档

## 模块概述

账户模块提供账户管理功能，包括账户的增删改查、转账和余额调整等操作。

## 接口列表

### 1. 获取所有账户

**接口地址**: `GET /api/accounts`

**请求方式**: GET

**请求头**:
```
Authorization: Bearer <your_jwt_token>
```

**成功响应** (200):
```json
[
  {
    "id": "507f1f77bcf86cd799439011",
    "name": "现金账户",
    "type": "cash",
    "balance": 1000.50,
    "currency": "CNY",
    "description": "日常现金",
    "createdAt": "2024-12-19T10:30:00.000Z",
    "updatedAt": "2024-12-19T10:30:00.000Z"
  },
  {
    "id": "507f1f77bcf86cd799439012",
    "name": "银行卡",
    "type": "bank",
    "balance": 5000.00,
    "currency": "CNY",
    "description": "主要储蓄账户",
    "createdAt": "2024-12-19T10:30:00.000Z",
    "updatedAt": "2024-12-19T10:30:00.000Z"
  }
]
```

### 2. 获取指定账户

**接口地址**: `GET /api/accounts/:id`

**请求方式**: GET

**请求头**:
```
Authorization: Bearer <your_jwt_token>
```

**路径参数**:
- `id` (string, 必填): 账户ID

**成功响应** (200):
```json
{
  "id": "507f1f77bcf86cd799439011",
  "name": "现金账户",
  "type": "cash",
  "balance": 1000.50,
  "currency": "CNY",
  "description": "日常现金",
  "createdAt": "2024-12-19T10:30:00.000Z",
  "updatedAt": "2024-12-19T10:30:00.000Z"
}
```

**错误响应** (404):
```json
{
  "message": "账户不存在"
}
```

### 3. 创建账户

**接口地址**: `POST /api/accounts`

**请求方式**: POST

**请求头**:
```
Content-Type: application/json
Authorization: Bearer <your_jwt_token>
```

**请求参数**:
```json
{
  "name": "支付宝",
  "type": "digital",
  "balance": 2000.00,
  "currency": "CNY",
  "description": "移动支付账户"
}
```

**参数说明**:
- `name` (string, 必填): 账户名称，最大50字符
- `type` (string, 必填): 账户类型，可选值：cash(现金)、bank(银行)、digital(数字钱包)
- `balance` (number, 必填): 初始余额
- `currency` (string, 可选): 货币类型，默认：CNY
- `description` (string, 可选): 账户描述，最大200字符

**成功响应** (201):
```json
{
  "message": "账户创建成功",
  "account": {
    "id": "507f1f77bcf86cd799439013",
    "name": "支付宝",
    "type": "digital",
    "balance": 2000.00,
    "currency": "CNY",
    "description": "移动支付账户",
    "createdAt": "2024-12-19T10:30:00.000Z",
    "updatedAt": "2024-12-19T10:30:00.000Z"
  }
}
```

**错误响应** (400):
```json
{
  "message": "账户名称不能为空"
}
```

### 4. 更新账户

**接口地址**: `PUT /api/accounts/:id`

**请求方式**: PUT

**请求头**:
```
Content-Type: application/json
Authorization: Bearer <your_jwt_token>
```

**路径参数**:
- `id` (string, 必填): 账户ID

**请求参数**:
```json
{
  "name": "支付宝账户",
  "type": "digital",
  "balance": 2500.00,
  "currency": "CNY",
  "description": "主要移动支付账户"
}
```

**成功响应** (200):
```json
{
  "message": "账户更新成功",
  "account": {
    "id": "507f1f77bcf86cd799439013",
    "name": "支付宝账户",
    "type": "digital",
    "balance": 2500.00,
    "currency": "CNY",
    "description": "主要移动支付账户",
    "createdAt": "2024-12-19T10:30:00.000Z",
    "updatedAt": "2024-12-19T10:35:00.000Z"
  }
}
```

**错误响应** (404):
```json
{
  "message": "账户不存在"
}
```

### 5. 删除账户

**接口地址**: `DELETE /api/accounts/:id`

**请求方式**: DELETE

**请求头**:
```
Authorization: Bearer <your_jwt_token>
```

**路径参数**:
- `id` (string, 必填): 账户ID

**成功响应** (200):
```json
{
  "message": "账户删除成功"
}
```

**错误响应** (404/400):
```json
{
  "message": "账户不存在或无法删除"
}
```

### 6. 账户转账

**接口地址**: `POST /api/accounts/transfer`

**请求方式**: POST

**请求头**:
```
Content-Type: application/json
Authorization: Bearer <your_jwt_token>
```

**请求参数**:
```json
{
  "fromAccountId": "507f1f77bcf86cd799439011",
  "toAccountId": "507f1f77bcf86cd799439012",
  "amount": 500.00,
  "description": "转账到银行卡"
}
```

**参数说明**:
- `fromAccountId` (string, 必填): 转出账户ID
- `toAccountId` (string, 必填): 转入账户ID
- `amount` (number, 必填): 转账金额，必须大于0
- `description` (string, 可选): 转账说明

**成功响应** (200):
```json
{
  "message": "转账成功",
  "transfer": {
    "id": "507f1f77bcf86cd799439014",
    "fromAccountId": "507f1f77bcf86cd799439011",
    "toAccountId": "507f1f77bcf86cd799439012",
    "amount": 500.00,
    "description": "转账到银行卡",
    "createdAt": "2024-12-19T10:30:00.000Z"
  }
}
```

**错误响应** (400):
```json
{
  "message": "余额不足"
}
```

### 7. 调整账户余额

**接口地址**: `POST /api/accounts/:id/adjust`

**请求方式**: POST

**请求头**:
```
Content-Type: application/json
Authorization: Bearer <your_jwt_token>
```

**路径参数**:
- `id` (string, 必填): 账户ID

**请求参数**:
```json
{
  "amount": 100.00,
  "type": "add",
  "description": "工资收入"
}
```

**参数说明**:
- `amount` (number, 必填): 调整金额
- `type` (string, 必填): 调整类型，add(增加) 或 subtract(减少)
- `description` (string, 可选): 调整说明

**成功响应** (200):
```json
{
  "message": "余额调整成功",
  "account": {
    "id": "507f1f77bcf86cd799439011",
    "name": "现金账户",
    "type": "cash",
    "balance": 1100.50,
    "currency": "CNY",
    "description": "日常现金",
    "createdAt": "2024-12-19T10:30:00.000Z",
    "updatedAt": "2024-12-19T10:35:00.000Z"
  }
}
```

**错误响应** (400):
```json
{
  "message": "调整类型无效"
}
```

## 数据模型

### 账户结构
```typescript
interface Account {
  id: string;
  name: string;
  type: 'cash' | 'bank' | 'digital';
  balance: number;
  currency: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### 转账记录结构
```typescript
interface Transfer {
  id: string;
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  description?: string;
  createdAt: Date;
}
```

## 账户类型说明

| 类型 | 说明 |
|------|------|
| cash | 现金账户 |
| bank | 银行账户 |
| digital | 数字钱包 |

## 错误码说明

| 状态码 | 说明 |
|--------|------|
| 200 | 操作成功 |
| 201 | 创建成功 |
| 400 | 请求参数错误 |
| 401 | 未授权 |
| 404 | 账户不存在 |
| 500 | 服务器内部错误 |

## 示例代码

### 获取账户列表
```javascript
fetch('/api/accounts', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
})
.then(response => response.json())
.then(data => {
  console.log('账户列表:', data);
});
```

### 创建账户
```javascript
const accountData = {
  name: "支付宝",
  type: "digital",
  balance: 2000.00,
  currency: "CNY",
  description: "移动支付账户"
};

fetch('/api/accounts', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  },
  body: JSON.stringify(accountData)
})
.then(response => response.json())
.then(data => {
  console.log('创建成功:', data);
});
```

### 账户转账
```javascript
const transferData = {
  fromAccountId: "507f1f77bcf86cd799439011",
  toAccountId: "507f1f77bcf86cd799439012",
  amount: 500.00,
  description: "转账到银行卡"
};

fetch('/api/accounts/transfer', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  },
  body: JSON.stringify(transferData)
})
.then(response => response.json())
.then(data => {
  console.log('转账成功:', data);
});
``` 