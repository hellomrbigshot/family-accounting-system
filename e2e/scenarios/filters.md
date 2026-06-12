# 筛选器 — VERIFY 步骤

> AC 定义：[workflow/history/features/filters/SPEC.md](../../workflow/history/features/filters/SPEC.md)  
> 测试映射：[TEST-CATALOG.md](../TEST-CATALOG.md) · filters 段（永久 verify-only）

## 场景

1. 打开 `/login` 并使用测试房间号、测试密码登录。
2. 进入 `/expenses`。
3. 打开筛选器管理入口。
4. 新建筛选器，名称填写 `E2E筛选器-<时间戳>`，选择任意可用分类或标签作为条件，保存。
5. 期望筛选器列表出现刚创建的筛选器。
6. 应用该筛选器。
7. 期望支出列表按筛选条件刷新，页面顶部或筛选区显示当前筛选器名称。
8. 点击清除筛选。
9. 期望恢复默认列表，日期筛选行为重新可用，当前筛选器名称不再显示。
10. 删除刚创建的测试筛选器并确认。
