# 报表模块 API 文档

## 模块概述

报表模块提供数据统计和报表功能，支持支出分析、趋势统计和数据导出。

## 接口列表

### 1. 获取报表数据

**接口地址**: `GET /api/reports`

**请求方式**: GET

**请求头**:
```
Authorization: Bearer <your_jwt_token>
```

**查询参数**:
- `startDate` (string, 可选): 开始日期，格式：YYYY-MM-DD
- `endDate` (string, 可选): 结束日期，格式：YYYY-MM-DD
- `type` (string, 可选): 报表类型，可选值：daily(日报)、weekly(周报)、monthly(月报)

**请求示例**:
```
GET /api/reports?startDate=2024-12-01&endDate=2024-12-31&type=monthly
```

**成功响应** (200):
```json
{
  "summary": {
    "totalExpense": 3200.50,
    "totalIncome": 0,
    "netAmount": -3200.50,
    "expenseCount": 25,
    "averageExpense": 128.02
  },
  "categoryStats": [
    {
      "categoryId": "507f1f77bcf86cd799439011",
      "categoryName": "餐饮",
      "total": 1200.50,
      "percentage": 37.5,
      "count": 15
    },
    {
      "categoryId": "507f1f77bcf86cd799439012",
      "categoryName": "交通",
      "total": 800.00,
      "percentage": 25.0,
      "count": 8
    }
  ],
  "dailyStats": [
    {
      "date": "2024-12-01",
      "total": 150.00,
      "count": 3
    },
    {
      "date": "2024-12-02",
      "total": 200.50,
      "count": 4
    }
  ],
  "trends": {
    "expenseTrend": "increasing",
    "topCategory": "餐饮",
    "mostExpensiveDay": "2024-12-15",
    "averageDailyExpense": 106.68
  }
}
```

### 2. 导出报表

**接口地址**: `GET /api/reports/export`

**请求方式**: GET

**请求头**:
```
Authorization: Bearer <your_jwt_token>
```

**查询参数**:
- `startDate` (string, 可选): 开始日期，格式：YYYY-MM-DD
- `endDate` (string, 可选): 结束日期，格式：YYYY-MM-DD
- `format` (string, 可选): 导出格式，可选值：csv、json，默认：csv

**请求示例**:
```
GET /api/reports/export?startDate=2024-12-01&endDate=2024-12-31&format=csv
```

**成功响应** (200):
```
Content-Type: text/csv
Content-Disposition: attachment; filename="expense_report_2024-12.csv"

日期,分类,金额,描述
2024-12-01,餐饮,50.00,早餐
2024-12-01,交通,20.00,地铁
2024-12-02,购物,100.50,买菜
...
```

**错误响应** (400):
```json
{
  "message": "导出格式不支持"
}
```

## 数据模型

### 报表摘要结构
```typescript
interface ReportSummary {
  totalExpense: number;
  totalIncome: number;
  netAmount: number;
  expenseCount: number;
  averageExpense: number;
}
```

### 分类统计结构
```typescript
interface CategoryStat {
  categoryId: string;
  categoryName: string;
  total: number;
  percentage: number;
  count: number;
}
```

### 日统计结构
```typescript
interface DailyStat {
  date: string;
  total: number;
  count: number;
}
```

### 趋势分析结构
```typescript
interface TrendAnalysis {
  expenseTrend: 'increasing' | 'decreasing' | 'stable';
  topCategory: string;
  mostExpensiveDay: string;
  averageDailyExpense: number;
}
```

## 报表类型说明

| 类型 | 说明 | 时间范围 |
|------|------|----------|
| daily | 日报 | 最近7天 |
| weekly | 周报 | 最近4周 |
| monthly | 月报 | 最近12个月 |

## 统计指标说明

### 基础指标
- **总支出**: 指定时间范围内的所有支出总和
- **支出笔数**: 指定时间范围内的支出记录数量
- **平均支出**: 总支出 / 支出笔数

### 分类分析
- **分类占比**: 各分类支出占总支出的百分比
- **分类排名**: 按支出金额排序的分类列表

### 趋势分析
- **支出趋势**: 与上一周期相比的支出变化趋势
- **最高支出日**: 单日支出最高的日期
- **日均支出**: 平均每日支出金额

## 错误码说明

| 状态码 | 说明 |
|--------|------|
| 200 | 操作成功 |
| 400 | 请求参数错误 |
| 401 | 未授权 |
| 500 | 服务器内部错误 |

## 示例代码

### 获取月度报表
```javascript
const params = new URLSearchParams({
  startDate: '2024-12-01',
  endDate: '2024-12-31',
  type: 'monthly'
});

fetch(`/api/reports?${params}`, {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
})
.then(response => response.json())
.then(data => {
  console.log('月度报表:', data);
  console.log('总支出:', data.summary.totalExpense);
  console.log('平均支出:', data.summary.averageExpense);
});
```

### 导出CSV报表
```javascript
const params = new URLSearchParams({
  startDate: '2024-12-01',
  endDate: '2024-12-31',
  format: 'csv'
});

fetch(`/api/reports/export?${params}`, {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
})
.then(response => response.blob())
.then(blob => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'expense_report.csv';
  a.click();
  window.URL.revokeObjectURL(url);
});
```

## 报表使用建议

1. **定期查看**: 建议每周查看一次周报，每月查看一次月报
2. **关注趋势**: 重点关注支出趋势变化，及时调整消费习惯
3. **分类分析**: 通过分类统计了解主要支出方向
4. **数据导出**: 定期导出报表数据进行备份和分析 