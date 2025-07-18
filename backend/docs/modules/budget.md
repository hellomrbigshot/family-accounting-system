# 预算模块 API 文档

## 模块概述

预算模块提供月度预算管理功能，支持预算的查询和更新。

## 接口列表

### 1. 获取当前预算

**接口地址**: `GET /api/budgets/current`

**请求方式**: GET

**请求头**:
```
Authorization: Bearer <your_jwt_token>
```

**成功响应** (200):
```json
{
  "id": "507f1f77bcf86cd799439011",
  "amount": 5000.00,
  "month": "2024-12",
  "spent": 3200.50,
  "remaining": 1799.50,
  "createdAt": "2024-12-01T00:00:00.000Z",
  "updatedAt": "2024-12-19T10:30:00.000Z"
}
```

**错误响应** (404):
```json
{
  "message": "当前月份预算不存在"
}
```

### 2. 更新当前预算

**接口地址**: `PUT /api/budgets/current`

**请求方式**: PUT

**请求头**:
```
Content-Type: application/json
Authorization: Bearer <your_jwt_token>
```

**请求参数**:
```json
{
  "amount": 6000.00
}
```

**参数说明**:
- `amount` (number, 必填): 预算金额，必须大于0

**成功响应** (200):
```json
{
  "message": "预算更新成功",
  "budget": {
    "id": "507f1f77bcf86cd799439011",
    "amount": 6000.00,
    "month": "2024-12",
    "spent": 3200.50,
    "remaining": 2799.50,
    "createdAt": "2024-12-01T00:00:00.000Z",
    "updatedAt": "2024-12-19T10:35:00.000Z"
  }
}
```

**错误响应** (400):
```json
{
  "message": "预算金额必须大于0"
}
```

## 数据模型

### 预算结构
```typescript
interface Budget {
  id: string;
  amount: number;
  month: string; // 格式：YYYY-MM
  spent: number; // 已支出金额
  remaining: number; // 剩余金额
  createdAt: Date;
  updatedAt: Date;
}
```

## 预算计算逻辑

1. **月度预算**: 每个月的预算独立管理
2. **已支出**: 自动计算当月所有支出记录的总和
3. **剩余金额**: `amount - spent`
4. **预算使用率**: `(spent / amount) * 100%`

## 错误码说明

| 状态码 | 说明 |
|--------|------|
| 200 | 操作成功 |
| 400 | 请求参数错误 |
| 401 | 未授权 |
| 404 | 预算不存在 |
| 500 | 服务器内部错误 |

## 示例代码

### 获取当前预算
```javascript
fetch('/api/budgets/current', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
})
.then(response => response.json())
.then(data => {
  console.log('当前预算:', data);
  console.log('预算使用率:', (data.spent / data.amount * 100).toFixed(2) + '%');
});
```

### 更新预算
```javascript
const budgetData = {
  amount: 6000.00
};

fetch('/api/budgets/current', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  },
  body: JSON.stringify(budgetData)
})
.then(response => response.json())
.then(data => {
  console.log('预算更新成功:', data);
});
```

## 预算管理建议

1. **合理设置**: 根据家庭收入和历史支出情况设置合理预算
2. **定期检查**: 建议每周检查预算使用情况
3. **灵活调整**: 可根据实际情况调整预算金额
4. **分类预算**: 可考虑按支出分类设置子预算

## 预算提醒

当预算使用率达到以下阈值时，建议关注：

- **80%**: 预算使用较多，需要控制支出
- **90%**: 预算即将用完，需要严格控制
- **100%**: 预算已用完，需要调整或增加预算 