# 家庭账本系统 API 文档

## 项目概述

家庭账本系统是一个基于 Node.js + Express + MongoDB 的全栈应用，提供家庭财务管理功能。

## 技术栈

- **后端框架**: Express.js
- **数据库**: MongoDB + Mongoose
- **认证**: JWT (JSON Web Token)
- **加密**: bcryptjs, CryptoJS
- **语言**: TypeScript

## 基础信息

- **基础URL**: `http://localhost:3000/api`
- **认证方式**: Bearer Token
- **数据格式**: JSON
- **字符编码**: UTF-8

## 认证说明

大部分接口需要认证，请在请求头中添加：

```
Authorization: Bearer <your_jwt_token>
```

## 响应格式

### 成功响应
```json
{
  "message": "操作成功",
  "data": {}
}
```

### 错误响应
```json
{
  "message": "错误信息",
  "error": "详细错误信息"
}
```

## 文档结构

- [认证模块](./modules/auth.md) - 用户登录、注册、获取用户信息
- [用户模块](./modules/user.md) - 用户管理相关接口
- [分类模块](./modules/category.md) - 支出分类管理
- [标签模块](./modules/tag.md) - 标签管理
- [支出模块](./modules/expense.md) - 支出记录管理
- [账户模块](./modules/account.md) - 账户管理
- [预算模块](./modules/budget.md) - 预算管理
- [报表模块](./modules/report.md) - 数据统计和报表
- [健康检查](./modules/health.md) - 系统健康检查

## 通用状态码

| 状态码 | 说明 |
|--------|------|
| 200 | 请求成功 |
| 201 | 创建成功 |
| 400 | 请求参数错误 |
| 401 | 未授权 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

## 更新日志

- **v1.0.0** - 初始版本，包含基础功能模块 