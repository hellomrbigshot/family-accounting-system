# 标签模块 API 文档

## 模块概述

标签模块用于管理支出标签，支持普通标签与限时标签。
限时标签有生效时间范围；删除标签使用软删除（归档），以保证历史支出和分析数据可追溯。

## 接口列表

### 1. 获取标签列表

- 地址: `GET /api/tags`
- 鉴权: `Authorization: Bearer <token>`

成功响应 `200`:

```json
[
  {
    "id": "507f1f77bcf86cd799439011",
    "name": "新疆旅游",
    "color": "#3B82F6",
    "type": "temporary",
    "startDate": "2026-05-20",
    "endDate": "2026-05-28",
    "autoApply": true,
    "archived": false,
    "createdAt": "2026-05-20T08:00:00.000Z"
  }
]
```

### 2. 创建标签

- 地址: `POST /api/tags`
- 鉴权: `Authorization: Bearer <token>`
- 请求头: `Content-Type: application/json`

请求体（普通标签）:

```json
{
  "name": "家庭常规",
  "color": "#F97316",
  "type": "normal"
}
```

请求体（限时标签）:

```json
{
  "name": "新疆旅游",
  "color": "#3B82F6",
  "type": "temporary",
  "startDate": "2026-05-20",
  "endDate": "2026-05-28",
  "autoApply": true
}
```

成功响应 `201`:

```json
{
  "id": "507f1f77bcf86cd799439011",
  "name": "新疆旅游",
  "color": "#3B82F6",
  "type": "temporary",
  "startDate": "2026-05-20",
  "endDate": "2026-05-28",
  "autoApply": true,
  "archived": false,
  "createdAt": "2026-05-20T08:00:00.000Z"
}
```

常见错误:

- `400`: 标签名称为必填项
- `400`: 标签名称已存在
- `400`: 标签类型无效
- `400`: 限时标签需要设置开始和结束日期
- `400`: 开始日期不能晚于结束日期

### 3. 更新标签

- 地址: `PUT /api/tags/:id`
- 鉴权: `Authorization: Bearer <token>`
- 请求头: `Content-Type: application/json`

请求体与创建标签一致。

成功响应 `200`:

```json
{
  "id": "507f1f77bcf86cd799439011",
  "name": "新疆旅游（调整）",
  "color": "#3B82F6",
  "type": "temporary",
  "startDate": "2026-05-20",
  "endDate": "2026-05-29",
  "autoApply": true,
  "archived": false,
  "createdAt": "2026-05-20T08:00:00.000Z"
}
```

常见错误:

- `404`: 标签不存在
- `400`: 标签名称已存在

### 4. 删除标签（软删除）

- 地址: `DELETE /api/tags/:id`
- 鉴权: `Authorization: Bearer <token>`

行为说明:

- 接口会把标签标记为 `archived: true`，不会物理删除。
- 已归档标签不能再用于新增/编辑时新选中。
- 历史支出和报表仍可读取标签名称用于展示与统计。

成功响应 `200`:

```json
{
  "message": "标签删除成功"
}
```

## 数据结构

```ts
interface Tag {
  id: string;
  name: string;
  color?: string;
  type: "normal" | "temporary";
  startDate?: string; // YYYY-MM-DD
  endDate?: string;   // YYYY-MM-DD
  autoApply: boolean;
  archived: boolean;
  createdAt: string;
}
```

## 错误码

| 状态码 | 说明 |
|---|---|
| 200 | 操作成功 |
| 201 | 创建成功 |
| 400 | 请求参数错误 |
| 401 | 未授权 |
| 404 | 标签不存在 |
| 500 | 服务器内部错误 |
