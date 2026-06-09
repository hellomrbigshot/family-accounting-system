# 预算 — 自然语言 E2E

来源：`workflow/history/features/budget/SPEC.md`

## 覆盖范围

- AC-1：打开预算弹窗
- AC-2：保存预算

## 场景

1. 打开 `/login` 并使用测试房间号、测试密码登录。
2. 在首页点击「设置预算」。
   - 如果普通点击不稳定，请使用有效命令：
     - `agent-browser eval '(() => { const btn = [...document.querySelectorAll("button, [role=button]")].find(el => el.textContent.includes("设置预算")); btn?.click(); })()'`
3. 期望出现「设置预算」弹窗，并展示预算金额输入区域。
   - 可以用 `agent-browser eval 'document.body.innerText.includes("预算金额") ? "found" : "not found"'` 辅助确认。
4. 将预算金额改为一个明显的 E2E 数值，例如 `8888` 或当前时间戳后四位。
5. 点击保存或确定按钮。
6. 期望弹窗关闭，首页「本月总览」中的预算金额更新为刚保存的值。
7. 刷新页面后再次确认预算金额仍保持更新后的值。
