# VERIFY / TEST 测试规则

## 分工

- **VERIFY**：agent-browser 或可用浏览器工具，按 SPEC 逐项探索确认；步骤见 `e2e/scenarios/*.md`。
- **TEST**：确定性 agent-browser 脚本（`pnpm test:e2e`）；AC 映射见 [`e2e/TEST-CATALOG.md`](../e2e/TEST-CATALOG.md)。

## VERIFY

```bash
agent-browser open http://localhost:5180
agent-browser snapshot -i
agent-browser errors
```

VERIFY 需记录：操作步骤、预期/实际结果、控制台错误、截图或备注。

## TEST

```bash
pnpm test:e2e
pnpm test:e2e auth
pnpm test:e2e smoke
```

当前守门脚本：

- `auth.sh` — 登录失败、登录成功、退出
- `smoke.sh` — 核心页面入口 + expenses AC-7 统计徽章

### 新功能 TEST 要求

GREEN 前每条 AC 必须在 `TEST-CATALOG.md` 登记，并满足 **至少一条**：

1. 在 `auth.sh` / `smoke.sh` 增加 1～2 条相关断言；或
2. 新增 `e2e/scripts/<模块>-issue-<N>.sh`；或
3. 标注 **verify-only** 并写清原因（禁止默认全部 verify-only）。

`pnpm test:e2e` 不依赖 `agent-browser chat`、AI Gateway 或 E2E bridge。

## 运行策略

| 时机 | 命令 |
|------|------|
| 单功能完成 | `pnpm test:e2e` |
| 发版前 | `pnpm test:e2e` + `bash e2e/scripts/verify-history.sh` |
| 大重构 | 同上 |

CI 不跑 E2E。

## DEV E2E Bridge（仅 VERIFY）

复杂 VERIFY（`verify-history.sh`）可用 `window.__FAS_E2E__.invoke`。规则见 [e2e-bridge.md](e2e-bridge.md)。

- handler **只**在 `frontend/src/e2e/handlers.ts`
- `pnpm test:e2e` **不得**依赖 bridge

## 永久 verify-only 模块

以下因 Vant 控件 / 环境依赖，维持 verify-only，见 TEST-CATALOG：

- 支出 CRUD、搜索、日期（除 AC-7 已 automated）
- 筛选器全流程
- 预算保存
- PWA 提示
