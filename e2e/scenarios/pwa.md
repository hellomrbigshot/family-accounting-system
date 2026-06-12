# PWA — VERIFY 步骤

> AC 定义：[workflow/history/features/pwa/SPEC.md](../../workflow/history/features/pwa/SPEC.md)  
> 测试映射：[TEST-CATALOG.md](../TEST-CATALOG.md) · pwa 段（verify-only，不纳入 `pnpm test:e2e`）

## AC-1：安装提示

**前提**：Chrome / Edge 移动端模拟或真机；应用未安装到主屏幕；浏览器支持 PWA 安装事件。

1. 清除站点数据或使用无痕窗口，打开 `${E2E_BASE_URL}/` 并登录。
2. 若满足展示条件，期望底部弹出「安装家庭账本」提示，含「稍后再说」「立即安装」。
3. 点击「稍后再说」，期望弹窗关闭且短期内不再打扰（或按产品策略 dismiss）。
4. 可选：再次触发安装流程，点击「立即安装」并完成系统安装向导（环境允许时）。

**无法自动化的常见原因**：`beforeinstallprompt` 由浏览器控制；已安装、桌面浏览器、部分 CI 环境不会触发。

## AC-2：更新提示

**前提**：已部署带 Service Worker 的生产或预览环境；能发布新版本以 bump SW。

1. 在旧版本页面保持打开并完成一次正常使用。
2. 部署新版本（或本地 `pnpm build` + preview 并修改 SW 缓存键）。
3. 切回已打开标签页或重新访问，期望出现「发现新版本」提示，展示当前版本与新版本号。
4. 点击「稍后更新」，期望弹窗关闭，应用仍可用。
5. 再次触发更新提示，点击「立即更新」，期望页面刷新并加载新版本。

**无法自动化的常见原因**：SW 更新时序、缓存策略、预览环境与生产不一致。

## 记录方式

手动 VERIFY 后，在 PR 或 `workflow/current/VERIFY.md` 中注明浏览器与设备、验证日期、AC-1 / AC-2 各自结果。
