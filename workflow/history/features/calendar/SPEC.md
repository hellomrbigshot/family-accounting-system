# SPEC — 验收标准 [追溯]

> source: retroactive | 页面：`/calendar`

## 验收标准

### AC-1：月份范围查询

- **Given**：用户在支出日历页
- **When**：选择起止月份并搜索
- **Then**：展示范围内各月日历面板，有支出的日期显示金额

### AC-2：跳转支出列表

- **Given**：日历上某日有支出
- **When**：点击该日期
- **Then**：跳转 `/expenses?date=YYYY-MM-DD`（或等价 query），列表对应该日

## 实现记录

`views/Calendar.vue` `CalendarMonthPanel.vue` `CalendarMonthRangeSearch.vue`
