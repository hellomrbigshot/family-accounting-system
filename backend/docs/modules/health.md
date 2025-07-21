# 健康检查模块 API 文档

## 模块概述

健康检查模块提供系统状态监控功能，用于检查服务是否正常运行、数据库连接状态等。

## 接口列表

### 1. 系统健康检查

**接口地址**: `GET /api/health`

**请求方式**: GET

**请求头**: 无

**成功响应** (200):
```json
{
  "status": "ok",
  "timestamp": "2024-12-19T10:30:00.000Z",
  "uptime": 86400.5,
  "database": {
    "status": "connected",
    "host": "localhost",
    "name": "family_accounting"
  }
}
```

**错误响应** (500):
```json
{
  "status": "error",
  "message": "Service unhealthy",
  "error": "Database not connected"
}
```

## 响应字段说明

### 基础信息
- `status` (string): 服务状态，ok 表示正常，error 表示异常
- `timestamp` (string): 检查时间戳，ISO 8601 格式
- `uptime` (number): 服务运行时间，单位：秒

### 数据库信息
- `database.status` (string): 数据库连接状态
- `database.host` (string): 数据库主机地址
- `database.name` (string): 数据库名称

## 数据库连接状态说明

| 状态 | 说明 |
|------|------|
| connected | 数据库连接正常 |
| disconnected | 数据库连接断开 |
| connecting | 正在连接数据库 |
| disconnecting | 正在断开数据库连接 |

## 使用场景

1. **负载均衡器健康检查**: 用于负载均衡器判断服务是否可用
2. **监控系统**: 用于监控系统检测服务状态
3. **运维管理**: 用于运维人员快速检查服务状态
4. **故障排查**: 用于排查系统故障时快速定位问题

## 示例代码

### 检查服务状态
```javascript
fetch('/api/health')
.then(response => response.json())
.then(data => {
  if (data.status === 'ok') {
    console.log('服务运行正常');
    console.log('运行时间:', Math.floor(data.uptime / 3600), '小时');
    console.log('数据库状态:', data.database.status);
  } else {
    console.error('服务异常:', data.message);
  }
})
.catch(error => {
  console.error('健康检查失败:', error);
});
```

### 定期健康检查
```javascript
// 每30秒检查一次服务状态
setInterval(() => {
  fetch('/api/health')
  .then(response => response.json())
  .then(data => {
    if (data.status !== 'ok') {
      console.error('服务异常:', data);
      // 可以发送告警通知
    }
  })
  .catch(error => {
    console.error('健康检查失败:', error);
  });
}, 30000);
```

## 监控建议

1. **定期检查**: 建议每30秒到1分钟检查一次
2. **告警设置**: 当状态为 error 时及时发送告警
3. **日志记录**: 记录健康检查的历史数据
4. **多维度监控**: 结合其他监控指标综合判断服务状态

## 故障排查

当健康检查返回错误时，可以按以下步骤排查：

1. **检查数据库连接**: 确认 MongoDB 服务是否正常运行
2. **检查网络连接**: 确认服务器网络连接正常
3. **检查服务进程**: 确认 Node.js 进程是否正常运行
4. **查看服务日志**: 查看应用日志获取详细错误信息 