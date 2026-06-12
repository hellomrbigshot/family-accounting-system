# 预算 — VERIFY 步骤

> AC 定义：[workflow/history/features/budget/SPEC.md](../../workflow/history/features/budget/SPEC.md)  
> 测试映射：[TEST-CATALOG.md](../TEST-CATALOG.md) · budget 段

## 场景

1. 打开 `/login` 并使用测试房间号、测试密码登录。
2. 在首页点击「设置预算」。
   - 如果普通点击不稳定，请使用有效命令：
     - `agent-browser eval '(() => { const btn = [...document.querySelectorAll("button, [role=button]")].find(el => el.textContent.includes("设置预算")); btn?.click(); })()'`
3. 期望出现「设置预算」弹窗，并展示预算金额输入区域。
4. 将预算金额改为一个明显的 E2E 数值，例如 `8888` 或当前时间戳后四位。
5. 点击保存或确定按钮。
6. 期望弹窗关闭，首页「本月总览」中的预算金额更新为刚保存的值。
7. 刷新页面后再次确认预算金额仍保持更新后的值。
