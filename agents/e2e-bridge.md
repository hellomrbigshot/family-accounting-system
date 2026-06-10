# E2E Bridge 规则（DEV VERIFY 专用）

## 定位

- **TEST**（`pnpm test:e2e`）：确定性守门，**不使用** bridge，不修改组件业务逻辑。
- **VERIFY**（`bash e2e/scripts/verify-history.sh`）：探索式全量验收，可在 DEV 使用 bridge。

Bridge 用于 agent-browser 无法稳定操作的 Vant 控件（数字键盘、picker、部分 field），不是业务功能的一部分。

## 代码组织（必须遵守）

### Handler 集中注册

所有 `e2eRegister(...)` **只能**写在：

```text
frontend/src/e2e/handlers.ts
```

入口：`frontend/src/main.ts` 在 `app.use(pinia)` 之后调用 `installE2E(pinia)`。

### Vue 组件边界

| 允许 | 禁止 |
|------|------|
| `data-testid="..."` 属性 | `import { e2eRegister } from '@/e2e/bridge'` |
| PWA 组件绑定 `e2e/state.ts`（见下） | 在 `onMounted` 里注册 handler |
| 正常业务逻辑 | 为 VERIFY 新增与业务无关的表单 fill/submit bridge |

### PWA 例外（唯一允许的 state 绑定）

`PWAInstallPrompt.vue` / `PWAUpdatePrompt.vue` 可在 DEV 下 `watch` `frontend/src/e2e/state.ts` 中的 `e2ePwaState`，用于显示 VERIFY 触发的弹窗。不得在此二文件注册 handler。

## Handler 实现原则

1. **优先** Pinia store action 或已有 API client。
2. **避免** 依赖组件内部 ref（弹窗开关、表单临时状态）。
3. 新增 handler 时同步更新 `e2e/scripts/verify-history.sh` 或 `e2e/scenarios/*.md`。
4. handler 命名：`模块.动作`，如 `expenses.editByDescription`。

## 审查清单

提交前自检：

- [ ] 无新增 `e2eRegister` 出现在 `components/` 或 `views/`
- [ ] 新 handler 仅在 `handlers.ts`
- [ ] `pnpm test:e2e` 不依赖新 handler
- [ ] 生产 `pnpm build` 不引用 bridge 行为路径

## 相关文档

- `frontend/src/e2e/README.md` — 目录说明
- `agents/testing.md` — VERIFY / TEST 分工
- `e2e/README.md` — 脚本与运行方式
