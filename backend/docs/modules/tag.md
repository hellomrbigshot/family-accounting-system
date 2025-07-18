# 标签模块 API 文档

## 模块概述

标签模块提供支出标签的增删改查功能，支持标签的创建、更新、删除和查询。

## 接口列表

### 1. 获取标签列表

**接口地址**: `GET /api/tags`

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
    "name": "必需品",
    "color": "#FF6B6B",
    "createdAt": "2024-12-19T10:30:00.000Z",
    "updatedAt": "2024-12-19T10:30:00.000Z"
  },
  {
    "id": "507f1f77bcf86cd799439012",
    "name": "奢侈品",
    "color": "#4ECDC4",
    "createdAt": "2024-12-19T10:30:00.000Z",
    "updatedAt": "2024-12-19T10:30:00.000Z"
  }
]
```

### 2. 创建标签

**接口地址**: `POST /api/tags`

**请求方式**: POST

**请求头**:
```
Content-Type: application/json
Authorization: Bearer <your_jwt_token>
```

**请求参数**:
```json
{
  "name": "紧急支出",
  "color": "#FF8A80"
}
```

**参数说明**:
- `name` (string, 必填): 标签名称，最大50字符
- `color` (string, 可选): 颜色代码，格式：#RRGGBB

**成功响应** (201):
```json
{
  "message": "标签创建成功",
  "tag": {
    "id": "507f1f77bcf86cd799439013",
    "name": "紧急支出",
    "color": "#FF8A80",
    "createdAt": "2024-12-19T10:30:00.000Z",
    "updatedAt": "2024-12-19T10:30:00.000Z"
  }
}
```

**错误响应** (400):
```json
{
  "message": "标签名称不能为空"
}
```

### 3. 更新标签

**接口地址**: `PUT /api/tags/:id`

**请求方式**: PUT

**请求头**:
```
Content-Type: application/json
Authorization: Bearer <your_jwt_token>
```

**路径参数**:
- `id` (string, 必填): 标签ID

**请求参数**:
```json
{
  "name": "非常紧急",
  "color": "#FF5252"
}
```

**成功响应** (200):
```json
{
  "message": "标签更新成功",
  "tag": {
    "id": "507f1f77bcf86cd799439013",
    "name": "非常紧急",
    "color": "#FF5252",
    "createdAt": "2024-12-19T10:30:00.000Z",
    "updatedAt": "2024-12-19T10:35:00.000Z"
  }
}
```

**错误响应** (404):
```json
{
  "message": "标签不存在"
}
```

### 4. 删除标签

**接口地址**: `DELETE /api/tags/:id`

**请求方式**: DELETE

**请求头**:
```
Authorization: Bearer <your_jwt_token>
```

**路径参数**:
- `id` (string, 必填): 标签ID

**成功响应** (200):
```json
{
  "message": "标签删除成功"
}
```

**错误响应** (404/400):
```json
{
  "message": "标签不存在或无法删除"
}
```

## 数据模型

### 标签结构
```typescript
interface Tag {
  id: string;
  name: string;
  color?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

## 预定义标签

系统初始化时会创建以下默认标签：

| 标签名称 | 颜色 |
|----------|------|
| 必需品 | #FF6B6B |
| 奢侈品 | #4ECDC4 |
| 紧急支出 | #FF8A80 |
| 计划支出 | #96CEB4 |
| 意外支出 | #FFEAA7 |

## 错误码说明

| 状态码 | 说明 |
|--------|------|
| 200 | 操作成功 |
| 201 | 创建成功 |
| 400 | 请求参数错误 |
| 401 | 未授权 |
| 404 | 标签不存在 |
| 500 | 服务器内部错误 |

## 示例代码

### 获取标签列表
```javascript
fetch('/api/tags', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
})
.then(response => response.json())
.then(data => {
  console.log('标签列表:', data);
});
```

### 创建标签
```javascript
const tagData = {
  name: "紧急支出",
  color: "#FF8A80"
};

fetch('/api/tags', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  },
  body: JSON.stringify(tagData)
})
.then(response => response.json())
.then(data => {
  console.log('创建成功:', data);
});
```

### 更新标签
```javascript
const updateData = {
  name: "非常紧急",
  color: "#FF5252"
};

fetch('/api/tags/507f1f77bcf86cd799439013', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  },
  body: JSON.stringify(updateData)
})
.then(response => response.json())
.then(data => {
  console.log('更新成功:', data);
});
``` 