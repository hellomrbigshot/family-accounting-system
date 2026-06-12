# 认证 — VERIFY 步骤

> AC 定义：[workflow/history/features/auth/SPEC.md](../../workflow/history/features/auth/SPEC.md)  
> 测试映射：[TEST-CATALOG.md](../TEST-CATALOG.md) · auth 段

## 场景

1. 打开 `${E2E_BASE_URL}/login`。
2. 输入测试房间号与测试密码，点击「登录」。
3. 期望跳转到首页，能看到「本月总览」和底部 Tab「首页」「支出」「日历」「更多」。
4. 打开「更多」页，点击「退出登录」，在确认弹窗中确认。
   - 不要使用 `dialog accept`、`accept`、`exec`、`js`、`evaluate` 等无效命令。
   - 如语义点击不稳定，请使用：
     - `agent-browser eval '(() => { const btn = [...document.querySelectorAll("button, [role=button]")].find(el => el.textContent.includes("退出登录")); btn?.click(); })()'`
     - `agent-browser wait 500`
     - `agent-browser eval '(() => { const dlg = document.querySelector("[role=dialog]") || document.body; const btn = [...dlg.querySelectorAll("button")].find(el => el.textContent.trim() === "确认"); btn?.click(); })()'`
5. 期望回到 `/login`，登录页表单可见。
6. 再次打开 `/login`，输入测试房间号和错误密码 `wrong-password`，点击「登录」。
7. 期望仍停留在 `/login`，并出现登录失败提示或错误信息。

## 注册验证说明

如需验证注册，请使用唯一房间号，例如 `E2E-<时间戳>`：

1. 打开 `/register`。
2. 填写唯一房间号、密码和确认密码。
3. 点击「注册」。
4. 期望注册成功并进入已登录状态。
