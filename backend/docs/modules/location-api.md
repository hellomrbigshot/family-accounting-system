# 消费地址功能 API 接口文档

## 1. 默认地址管理 API

### 1.1 创建默认地址

**接口**：`POST /user-default-locations`

**认证**：需要 JWT 认证

**请求体**：
```json
{
  "startDate": "2024-01-01",
  "endDate": "2024-12-31",
  "location": "北京市朝阳区"
}
```

**字段说明**：
- `startDate` (必填): 默认地址生效开始日期，格式：YYYY-MM-DD
- `endDate` (可选): 默认地址生效结束日期，格式：YYYY-MM-DD。如果未提供，表示永久有效
- `location` (必填): 默认地址，最大长度 200 字符

**成功响应** (201)：
```json
{
  "message": "默认地址创建成功",
  "defaultLocation": {
    "id": "507f1f77bcf86cd799439011",
    "userId": "507f1f77bcf86cd799439012",
    "startDate": "2024-01-01T00:00:00.000Z",
    "endDate": "2024-12-31T23:59:59.999Z",
    "location": "北京市朝阳区",
    "isActive": true,
    "createdAt": "2024-01-01T10:00:00.000Z",
    "updatedAt": "2024-01-01T10:00:00.000Z"
  }
}
```

**错误响应** (400)：
```json
{
  "message": "时间段与其他默认地址重叠",
  "error": "时间段 2024-01-01 至 2024-12-31 与现有默认地址重叠"
}
```

**错误响应** (401)：
```json
{
  "message": "未授权访问"
}
```

### 1.2 获取默认地址列表

**接口**：`GET /user-default-locations`

**认证**：需要 JWT 认证

**查询参数**：
- `startDate` (可选): 查询开始日期，格式：YYYY-MM-DD
- `endDate` (可选): 查询结束日期，格式：YYYY-MM-DD
- `includeInactive` (可选): 是否包含非激活的地址，默认 false

**成功响应** (200)：
```json
[
  {
    "id": "507f1f77bcf86cd799439011",
    "userId": "507f1f77bcf86cd799439012",
    "startDate": "2024-01-01T00:00:00.000Z",
    "endDate": "2024-12-31T23:59:59.999Z",
    "location": "北京市朝阳区",
    "isActive": true,
    "createdAt": "2024-01-01T10:00:00.000Z",
    "updatedAt": "2024-01-01T10:00:00.000Z"
  },
  {
    "id": "507f1f77bcf86cd799439013",
    "userId": "507f1f77bcf86cd799439012",
    "startDate": "2025-01-01T00:00:00.000Z",
    "endDate": null,
    "location": "上海市浦东新区",
    "isActive": true,
    "createdAt": "2024-12-01T10:00:00.000Z",
    "updatedAt": "2024-12-01T10:00:00.000Z"
  }
]
```

### 1.3 获取当前默认地址

**接口**：`GET /user-default-locations/current`

**认证**：需要 JWT 认证

**查询参数**：
- `date` (可选): 查询日期，格式：YYYY-MM-DD，默认为今天

**成功响应** (200)：
```json
{
  "id": "507f1f77bcf86cd799439011",
  "userId": "507f1f77bcf86cd799439012",
  "startDate": "2024-01-01T00:00:00.000Z",
  "endDate": "2024-12-31T23:59:59.999Z",
  "location": "北京市朝阳区",
  "isActive": true,
  "createdAt": "2024-01-01T10:00:00.000Z",
  "updatedAt": "2024-01-01T10:00:00.000Z"
}
```

**未找到响应** (404)：
```json
{
  "message": "未找到该日期的默认地址"
}
```

### 1.4 更新默认地址

**接口**：`PUT /user-default-locations/:id`

**认证**：需要 JWT 认证

**路径参数**：
- `id`: 默认地址 ID

**请求体**：
```json
{
  "startDate": "2024-01-01",
  "endDate": "2024-12-31",
  "location": "北京市海淀区",
  "isActive": true
}
```

**字段说明**：所有字段都是可选的，只更新提供的字段

**成功响应** (200)：
```json
{
  "message": "默认地址更新成功",
  "defaultLocation": {
    "id": "507f1f77bcf86cd799439011",
    "userId": "507f1f77bcf86cd799439012",
    "startDate": "2024-01-01T00:00:00.000Z",
    "endDate": "2024-12-31T23:59:59.999Z",
    "location": "北京市海淀区",
    "isActive": true,
    "createdAt": "2024-01-01T10:00:00.000Z",
    "updatedAt": "2024-01-02T10:00:00.000Z"
  }
}
```

**错误响应** (404)：
```json
{
  "message": "默认地址不存在"
}
```

### 1.5 删除默认地址

**接口**：`DELETE /user-default-locations/:id`

**认证**：需要 JWT 认证

**路径参数**：
- `id`: 默认地址 ID

**成功响应** (200)：
```json
{
  "message": "默认地址删除成功"
}
```

**错误响应** (404)：
```json
{
  "message": "默认地址不存在"
}
```

## 2. 支出 API 扩展

### 2.1 创建支出（扩展）

**接口**：`POST /expenses`

**认证**：需要 JWT 认证

**请求体扩展**：
```json
{
  "date": "2024-01-15",
  "category": "507f1f77bcf86cd799439014",
  "amount": 100.50,
  "description": "午餐",
  "tags": ["507f1f77bcf86cd799439015"],
  "isExtra": false,
  "location": "北京市朝阳区某餐厅"
}
```

**字段说明**：
- `location` (可选): 消费地址。如果未提供，系统会根据 `date` 查找对应时间段的默认地址

**响应扩展**：
```json
{
  "message": "支出记录创建成功",
  "expense": {
    "id": "507f1f77bcf86cd799439016",
    "date": "2024-01-15T00:00:00.000Z",
    "category": "507f1f77bcf86cd799439014",
    "amount": 100.50,
    "description": "午餐",
    "tags": ["507f1f77bcf86cd799439015"],
    "isExtra": false,
    "location": "北京市朝阳区某餐厅",
    "createdAt": "2024-01-15T12:00:00.000Z"
  }
}
```

### 2.2 更新支出（扩展）

**接口**：`PUT /expenses/:id`

**认证**：需要 JWT 认证

**请求体扩展**：
```json
{
  "date": "2024-01-15",
  "category": "507f1f77bcf86cd799439014",
  "amount": 100.50,
  "description": "午餐",
  "tags": ["507f1f77bcf86cd799439015"],
  "isExtra": false,
  "location": "北京市朝阳区某餐厅"
}
```

**响应扩展**：
```json
{
  "message": "支出记录更新成功",
  "expense": {
    "id": "507f1f77bcf86cd799439016",
    "date": "2024-01-15T00:00:00.000Z",
    "category": "507f1f77bcf86cd799439014",
    "amount": 100.50,
    "description": "午餐",
    "tags": ["507f1f77bcf86cd799439015"],
    "isExtra": false,
    "location": "北京市朝阳区某餐厅",
    "createdAt": "2024-01-15T12:00:00.000Z"
  }
}
```

### 2.3 查询支出（扩展）

**接口**：`GET /expenses`

**认证**：需要 JWT 认证

**查询参数扩展**：
- `location` (可选): 按地址筛选，支持模糊匹配

**响应扩展**：
```json
[
  {
    "id": "507f1f77bcf86cd799439016",
    "date": "2024-01-15T00:00:00.000Z",
    "category": "507f1f77bcf86cd799439014",
    "amount": 100.50,
    "description": "午餐",
    "tags": ["507f1f77bcf86cd799439015"],
    "isExtra": false,
    "location": "北京市朝阳区某餐厅",
    "createdAt": "2024-01-15T12:00:00.000Z"
  }
]
```

## 3. 地址查询和统计 API

### 3.1 获取消费地址列表

**接口**：`GET /expenses/locations`

**认证**：需要 JWT 认证

**查询参数**：
- `startDate` (可选): 查询开始日期，格式：YYYY-MM-DD
- `endDate` (可选): 查询结束日期，格式：YYYY-MM-DD
- `keyword` (可选): 地址关键词搜索

**成功响应** (200)：
```json
[
  {
    "location": "北京市朝阳区某餐厅",
    "count": 15,
    "totalAmount": 1500.00,
    "firstDate": "2024-01-01",
    "lastDate": "2024-01-31"
  },
  {
    "location": "上海市浦东新区某商场",
    "count": 8,
    "totalAmount": 2400.00,
    "firstDate": "2024-02-01",
    "lastDate": "2024-02-28"
  }
]
```

### 3.2 获取地址时间轴

**接口**：`GET /expenses/locations/timeline`

**认证**：需要 JWT 认证

**查询参数**：
- `startDate` (可选): 查询开始日期，格式：YYYY-MM-DD
- `endDate` (可选): 查询结束日期，格式：YYYY-MM-DD
- `includeExpenses` (可选): 是否包含消费记录详情，默认 false

**成功响应** (200)：
```json
[
  {
    "date": "2024-01-15",
    "location": "北京市朝阳区某餐厅",
    "expenseCount": 2,
    "totalAmount": 200.00,
    "expenses": [
      {
        "id": "507f1f77bcf86cd799439016",
        "category": "507f1f77bcf86cd799439014",
        "amount": 100.00,
        "description": "午餐"
      },
      {
        "id": "507f1f77bcf86cd799439017",
        "category": "507f1f77bcf86cd799439014",
        "amount": 100.00,
        "description": "晚餐"
      }
    ]
  },
  {
    "date": "2024-01-14",
    "location": "上海市浦东新区某商场",
    "expenseCount": 1,
    "totalAmount": 300.00,
    "expenses": []
  }
]
```

### 3.3 根据地址查询消费记录

**接口**：`GET /expenses/locations/:location`

**认证**：需要 JWT 认证

**路径参数**：
- `location`: 地址（URL 编码）

**查询参数**：
- `startDate` (可选): 查询开始日期，格式：YYYY-MM-DD
- `endDate` (可选): 查询结束日期，格式：YYYY-MM-DD
- `page` (可选): 页码，默认 1
- `pageSize` (可选): 每页数量，默认 20

**成功响应** (200)：
```json
{
  "location": "北京市朝阳区某餐厅",
  "totalCount": 15,
  "totalAmount": 1500.00,
  "expenses": [
    {
      "id": "507f1f77bcf86cd799439016",
      "date": "2024-01-15T00:00:00.000Z",
      "category": "507f1f77bcf86cd799439014",
      "amount": 100.00,
      "description": "午餐",
      "tags": ["507f1f77bcf86cd799439015"],
      "isExtra": false
    }
  ]
}
```

**错误响应** (404)：
```json
{
  "message": "未找到该地址的消费记录"
}
```

## 4. 错误码说明

| 状态码 | 说明 |
|--------|------|
| 200 | 请求成功 |
| 201 | 创建成功 |
| 400 | 请求参数错误 |
| 401 | 未授权访问 |
| 404 | 资源不存在 |
| 409 | 资源冲突（如时间段重叠） |
| 500 | 服务器内部错误 |

## 5. 数据格式说明

### 5.1 日期格式
- 所有日期字段使用 ISO 8601 格式：`YYYY-MM-DD`
- 时间字段使用 ISO 8601 格式：`YYYY-MM-DDTHH:mm:ss.sssZ`

### 5.2 地址格式
- 地址为字符串类型，最大长度 200 字符
- 建议使用标准地址格式，如：`省市区详细地址`
- 支持中文、英文、数字和常见标点符号


