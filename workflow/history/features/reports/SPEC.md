# SPEC — 验收标准 [追溯]

> source: retroactive | 页面：`/reports`

## 验收标准

### AC-1：日期查询

- **Given**：用户在支出分析页
- **When**：选择起止日期并点击查询
- **Then**：展示该时间段总支出、额外支出统计

### AC-2：图表

- **When**：查询成功
- **Then**：展示趋势分析、分类分析图表（ECharts）

### AC-3：加载态

- **When**：数据请求中
- **Then**：显示骨架屏，完成后展示内容

## 实现记录

`views/Reports.vue` `TrendAnalysis.vue` `CategoryAnalysis.vue` `stores/report.ts`
