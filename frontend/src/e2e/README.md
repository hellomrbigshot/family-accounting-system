# DEV E2E Bridge（仅 VERIFY）

供 `e2e/scripts/verify-history.sh` 在 agent-browser 中绕过 Vant 弹层/键盘不稳定问题。

## 目录职责

| 文件 | 职责 |
|------|------|
| `bridge.ts` | 暴露 `window.__FAS_E2E__.invoke`，DEV 入口 `installE2E(pinia)` |
| `handlers.ts` | **唯一** handler 注册处；走 Pinia store / API |
| `state.ts` | 无法经 store 驱动的 DEV 可见性（目前仅 PWA 弹窗） |

## 禁止事项

- **禁止**在 `frontend/src/components`、`frontend/src/views` 中调用 `e2eRegister` 或新增 handler。
- **禁止**在 `pnpm test:e2e`（auth/smoke）脚本中依赖 bridge。
- **禁止**在生产构建中依赖 bridge（已由 `import.meta.env.DEV` 守卫）。

## 允许事项

- 业务组件可保留 `data-testid`（供 agent-browser 点击）。
- PWA 提示组件可 `import { e2ePwaState } from '@/e2e/state'` 做 DEV 可见性同步（见 `agents/e2e-bridge.md`）。

## 新增 handler 流程

1. 在 `handlers.ts` 添加 handler，优先复用 store/API。
2. 在 `e2e/scripts/verify-history.sh` 或场景文档中调用。
3. 不在 Vue 组件中扩散。
