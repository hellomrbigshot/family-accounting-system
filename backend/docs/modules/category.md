# 分类模块 API 文档

## 模块概述

分类模块提供支出分类的增删改查功能，支持分类的创建、更新、删除和查询。

## 接口列表

### 1. 获取分类列表

**接口地址**: `GET /api/categories`

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
    "name": "餐饮",
    "icon": "restaurant",
    "color": "#FF6B6B",
    "createdAt": "2024-12-19T10:30:00.000Z",
    "updatedAt": "2024-12-19T10:30:00.000Z"
  },
  {
    "id": "507f1f77bcf86cd799439012",
    "name": "交通",
    "icon": "directions_car",
    "color": "#4ECDC4",
    "createdAt": "2024-12-19T10:30:00.000Z",
    "updatedAt": "2024-12-19T10:30:00.000Z"
  }
]
```

### 2. 创建分类

**接口地址**: `POST /api/categories`

**请求方式**: POST

**请求头**:
```
Content-Type: application/json
Authorization: Bearer <your_jwt_token>
```

**请求参数**:
```json
{
  "name": "购物",
  "icon": "shopping_cart",
  "color": "#45B7D1"
}
```

**参数说明**:
- `name` (string, 必填): 分类名称，最大50字符
- `icon` (string, 可选): 图标名称
- `color` (string, 可选): 颜色代码，格式：#RRGGBB

**成功响应** (201):
```json
{
  "message": "分类创建成功",
  "category": {
    "id": "507f1f77bcf86cd799439013",
    "name": "购物",
    "icon": "shopping_cart",
    "color": "#45B7D1",
    "createdAt": "2024-12-19T10:30:00.000Z",
    "updatedAt": "2024-12-19T10:30:00.000Z"
  }
}
```

**错误响应** (400):
```json
{
  "message": "分类名称不能为空"
}
```

### 3. 更新分类

**接口地址**: `PUT /api/categories/:id`

**请求方式**: PUT

**请求头**:
```
Content-Type: application/json
Authorization: Bearer <your_jwt_token>
```

**路径参数**:
- `id` (string, 必填): 分类ID

**请求参数**:
```json
{
  "name": "日常购物",
  "icon": "shopping_bag",
  "color": "#FF8A80"
}
```

**成功响应** (200):
```json
{
  "message": "分类更新成功",
  "category": {
    "id": "507f1f77bcf86cd799439013",
    "name": "日常购物",
    "icon": "shopping_bag",
    "color": "#FF8A80",
    "createdAt": "2024-12-19T10:30:00.000Z",
    "updatedAt": "2024-12-19T10:35:00.000Z"
  }
}
```

**错误响应** (404):
```json
{
  "message": "分类不存在"
}
```

### 4. 删除分类

**接口地址**: `DELETE /api/categories/:id`

**请求方式**: DELETE

**请求头**:
```
Authorization: Bearer <your_jwt_token>
```

**路径参数**:
- `id` (string, 必填): 分类ID

**成功响应** (200):
```json
{
  "message": "分类删除成功"
}
```

**错误响应** (404/400):
```json
{
  "message": "分类不存在或无法删除"
}
```

## 数据模型

### 分类结构
```typescript
interface Category {
  id: string;
  name: string;
  icon?: string;
  color?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

## 预定义分类

系统初始化时会创建以下默认分类：

| 分类名称 | 图标 | 颜色 |
|----------|------|------|
| 餐饮 | restaurant | #FF6B6B |
| 交通 | directions_car | #4ECDC4 |
| 购物 | shopping_cart | #45B7D1 |
| 娱乐 | movie | #96CEB4 |
| 医疗 | local_hospital | #FFEAA7 |
| 教育 | school | #DDA0DD |
| 住房 | home | #98D8C8 |
| 其他 | more_horiz | #F7DC6F |

## 错误码说明

| 状态码 | 说明 |
|--------|------|
| 200 | 操作成功 |
| 201 | 创建成功 |
| 400 | 请求参数错误 |
| 401 | 未授权 |
| 404 | 分类不存在 |
| 500 | 服务器内部错误 |

## 示例代码

### 获取分类列表
```javascript
fetch('/api/categories', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
})
.then(response => response.json())
.then(data => {
  console.log('分类列表:', data);
});
```

### 创建分类
```javascript
const categoryData = {
  name: "购物",
  icon: "shopping_cart",
  color: "#45B7D1"
};

fetch('/api/categories', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  },
  body: JSON.stringify(categoryData)
})
.then(response => response.json())
.then(data => {
  console.log('创建成功:', data);
});
```

### 更新分类
```javascript
const updateData = {
  name: "日常购物",
  icon: "shopping_bag",
  color: "#FF8A80"
};

fetch('/api/categories/507f1f77bcf86cd799439013', {
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