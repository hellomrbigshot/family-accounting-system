# 首页 — VERIFY 步骤

> AC 定义：[workflow/history/features/home/SPEC.md](../../workflow/history/features/home/SPEC.md)  
> 测试映射：[TEST-CATALOG.md](../TEST-CATALOG.md) · home 段

## 场景

1. 打开 `/login` 并使用测试房间号、测试密码登录。
2. 进入首页 `/`。
3. 期望看到「本月总览」、预算金额、已支出金额、进度条和使用百分比。
4. 期望看到「最近支出」区域；如果没有支出数据，可以接受空状态，但页面不能报错。
5. 点击首页的「分类管理」快捷入口。
6. 期望跳转到 `/categories`，并看到「分类管理」页面标题或分类/标签 Tab。
7. 返回首页。如果当前月支出超过预算，确认金额或进度条出现红色警示样式；如果未超预算，记录为条件未满足而非失败。
