# VERIFY / TEST 测试规则

## 分工

- VERIFY：使用 agent-browser 或其他可用浏览器工具做探索式验证，按 SPEC 逐项确认。
- TEST：使用确定性 agent-browser 脚本作为轻量守门，执行 `pnpm test:e2e`。

## VERIFY

VERIFY 可参考 `e2e/scenarios/*.md` 的自然语言步骤。

常用命令：

```bash
agent-browser open http://localhost:5180
agent-browser snapshot -i
agent-browser errors
```

VERIFY 需要记录：

- 操作步骤
- 预期结果
- 实际结果
- 控制台错误
- 截图或备注（如需要）

## TEST

稳定 E2E 命令：

```bash
pnpm test:e2e
pnpm test:e2e auth
pnpm test:e2e smoke
```

当前守门范围：

- 错误密码停留登录页
- 正确登录进入首页
- 退出登录回到登录页
- 首页、本月总览、最近支出
- 支出页、日历页、分类/标签页、报表页、更多页
- 预算弹窗可打开

## DEV E2E Bridge（仅 VERIFY）

复杂 VERIFY 脚本（`e2e/scripts/verify-history.sh`）可在开发模式使用 `window.__FAS_E2E__.invoke`。

**硬性规则**见 [E2E Bridge 规则](e2e-bridge.md)，摘要：

- handler **只**在 `frontend/src/e2e/handlers.ts` 维护
- **禁止**在 Vue 组件中 `e2eRegister`
- `pnpm test:e2e` **不得**依赖 bridge

## 不纳入长期 E2E 的内容

以下复杂流程优先在 VERIFY 阶段专项验证，不默认放入长期守门脚本：

- 新增支出完整表单
- Vant 数字键盘输入
- 左滑删除
- 限时标签复杂日期
- 筛选器组合
- 图表细节

这样可以保持 E2E 轻量稳定，避免测试体系过重。
