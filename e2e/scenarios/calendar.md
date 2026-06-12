# 日历 — VERIFY 步骤

> AC 定义：[workflow/history/features/calendar/SPEC.md](../../workflow/history/features/calendar/SPEC.md)  
> 测试映射：[TEST-CATALOG.md](../TEST-CATALOG.md) · calendar 段

## 场景

1. 打开 `/login` 并使用测试房间号、测试密码登录。
2. 进入 `/calendar` 或点击底部 Tab「日历」。
3. 期望看到「支出日历」页面。
4. 使用月份范围查询控件选择当前月份作为开始月份和结束月份，点击「查询」。
5. 期望页面展示当前月份日历面板。
6. 如果当前月份存在有支出的日期，点击该日期。
7. 期望跳转到 `/expenses`，并携带对应日期 query 或展示该日支出记录。
8. 如果当前月份没有支出数据，先创建一条今天的 E2E 支出，再回到日历页重复第 4 到第 7 步。
