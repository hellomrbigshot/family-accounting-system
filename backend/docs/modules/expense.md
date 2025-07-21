# 支出模块 API 文档

## 模块概述

支出模块提供支出记录的增删改查功能，支持按日期范围查询、分类统计等。

## 接口列表

### 1. 创建支出记录

**接口地址**: `POST /api/expenses`

**请求方式**: POST

**请求头**:
```
Content-Type: application/json
Authorization: Bearer <your_jwt_token>
```

**请求参数**:
```json
{
  "date": "2024-12-19",
  "category": "507f1f77bcf86cd799439011",
  "amount": 100.50,
  "description": "买菜",
  "tags": ["507f1f77bcf86cd799439012"]
}
```

**参数说明**:
- `date` (string, 必填): 支出日期，格式：YYYY-MM-DD
- `category` (string, 必填): 分类ID
- `amount` (number, 必填): 支出金额，必须大于0
- `description` (string, 可选): 支出描述，最大200字符
- `tags` (array, 可选): 标签ID数组

**成功响应** (201):
```json
{
  "message": "支出记录创建成功",
  "expense": {
    "id": "507f1f77bcf86cd799439013",
    "date": "2024-12-19T00:00:00.000Z",
    "category": "507f1f77bcf86cd799439011",
    "amount": 100.5,
    "description": "买菜",
    "tags": ["507f1f77bcf86cd799439012"],
    "createdAt": "2024-12-19T10:30:00.000Z"
  }
}
```

**错误响应** (400/401):
```json
{
  "message": "支出金额必须大于0"
}
```

### 2. 获取支出列表

**接口地址**: `GET /api/expenses`

**请求方式**: GET

**请求头**:
```
Authorization: Bearer <your_jwt_token>
```

**查询参数**:
- `startDate` (string, 可选): 开始日期，格式：YYYY-MM-DD
- `endDate` (string, 可选): 结束日期，格式：YYYY-MM-DD
- `category` (string, 可选): 分类ID

**请求示例**:
```
GET /api/expenses?startDate=2024-12-01&endDate=2024-12-31&category=507f1f77bcf86cd799439011
```

**成功响应** (200):
```json
[
  {
    "id": "507f1f77bcf86cd799439013",
    "date": "2024-12-19T00:00:00.000Z",
    "category": "507f1f77bcf86cd799439011",
    "amount": 100.5,
    "description": "买菜",
    "tags": ["507f1f77bcf86cd799439012"],
    "createdAt": "2024-12-19T10:30:00.000Z"
  }
]
```

### 3. 获取支出统计

**接口地址**: `GET /api/expenses/stats`

**请求方式**: GET

**请求头**:
```
Authorization: Bearer <your_jwt_token>
```

**查询参数**:
- `startDate` (string, 可选): 开始日期，格式：YYYY-MM-DD
- `endDate` (string, 可选): 结束日期，格式：YYYY-MM-DD

**成功响应** (200):
```json
{
  "categoryStats": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "total": 500.5
    }
  ],
  "dateStats": [
    {
      "_id": "2024-12-19",
      "total": 100.5
    }
  ]
}
```

### 4. 更新支出记录

**接口地址**: `PUT /api/expenses/:id`

**请求方式**: PUT

**请求头**:
```
Content-Type: application/json
Authorization: Bearer <your_jwt_token>
```

**路径参数**:
- `id` (string, 必填): 支出记录ID

**请求参数**:
```json
{
  "date": "2024-12-19",
  "category": "507f1f77bcf86cd799439011",
  "amount": 120.50,
  "description": "买菜和水果",
  "tags": ["507f1f77bcf86cd799439012"]
}
```

**成功响应** (200):
```json
{
  "message": "支出记录更新成功",
  "expense": {
    "id": "507f1f77bcf86cd799439013",
    "date": "2024-12-19T00:00:00.000Z",
    "category": "507f1f77bcf86cd799439011",
    "amount": 120.5,
    "description": "买菜和水果",
    "tags": ["507f1f77bcf86cd799439012"],
    "createdAt": "2024-12-19T10:30:00.000Z"
  }
}
```

**错误响应** (404):
```json
{
  "message": "支出记录不存在"
}
```

### 5. 删除支出记录

**接口地址**: `DELETE /api/expenses/:id`

**请求方式**: DELETE

**请求头**:
```
Authorization: Bearer <your_jwt_token>
```

**路径参数**:
- `id` (string, 必填): 支出记录ID

**成功响应** (200):
```json
{
  "message": "支出记录删除成功"
}
```

**错误响应** (404):
```json
{
  "message": "支出记录不存在"
}
```

## 数据模型

### 支出记录结构
```typescript
interface Expense {
  id: string;
  date: Date;
  category: string; // 分类ID
  amount: number;
  description?: string;
  tags: string[]; // 标签ID数组
  createdAt: Date;
  updatedAt: Date;
}
```

## 错误码说明

| 状态码 | 说明 |
|--------|------|
| 200 | 操作成功 |
| 201 | 创建成功 |
| 400 | 请求参数错误 |
| 401 | 未授权 |
| 404 | 记录不存在 |
| 500 | 服务器内部错误 |

## 示例代码

### 创建支出记录
```javascript
const expenseData = {
  date: "2024-12-19",
  category: "507f1f77bcf86cd799439011",
  amount: 100.50,
  description: "买菜",
  tags: ["507f1f77bcf86cd799439012"]
};

fetch('/api/expenses', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  },
  body: JSON.stringify(expenseData)
})
.then(response => response.json())
.then(data => {
  console.log('创建成功:', data);
});
```

### 获取支出列表
```javascript
fetch('/api/expenses?startDate=2024-12-01&endDate=2024-12-31', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
})
.then(response => response.json())
.then(data => {
  console.log('支出列表:', data);
});
``` 