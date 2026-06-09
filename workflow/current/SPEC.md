# SPEC — 验收标准

> 状态：✅ 完成

## 基本信息

| 字段 | 内容 |
|------|------|
| 任务名称 | 调整 agent-browser 测试分工：VERIFY 自然语言，TEST 确定性 smoke |
| 类型 | chore |
| 关联 Issue | — |
| 创建日期 | 2026-06-09 |
| 负责人 | AI |

## 背景与目标

项目已有历史功能追溯 SPEC 与 agent-browser 测试雏形。实测发现 `agent-browser chat` 适合 VERIFY 阶段探索，但不适合作为长期稳定 E2E 守门；TEST 阶段应使用确定性 agent-browser 命令脚本，避免依赖模型网关与自然语言执行漂移。

## 范围

### 包含

- 保留 `e2e/scenarios/*.md` 作为 VERIFY 阶段自然语言验证说明。
- 将 `pnpm test:e2e` 调整为只运行稳定确定性脚本：`auth.sh` 与 `smoke.sh`。
- 删除各模块中调用 `agent-browser chat` 的无用脚本与 helper。
- 更新 E2E README、历史补档说明与功能清单。
- 验证本地 `pnpm dev` 下确定性 E2E 可通过。

### 不包含

- 不引入 Playwright。
- 不把复杂表单、数字键盘、左滑删除、限时标签等流程纳入长期 E2E 守门。
- 不修改业务功能实现。
- 不删除 `e2e/scenarios/*.md`，它们仍用于 VERIFY。

## 验收标准

### AC-1：VERIFY / TEST 分工清晰

- **Given**：查看 `e2e/README.md` 与 `workflow/history/README.md`
- **When**：阅读测试策略
- **Then**：明确 VERIFY 使用自然语言场景，TEST 使用确定性 agent-browser 脚本

### AC-2：E2E 不依赖 AI Gateway

- **Given**：未配置或不使用 `AI_GATEWAY_API_KEY`
- **When**：运行 `pnpm test:e2e`
- **Then**：测试不调用 `agent-browser chat`，不依赖模型网关

### AC-3：确定性脚本轻量稳定

- **Given**：本地 `pnpm dev` 已启动
- **When**：运行 `pnpm test:e2e`
- **Then**：只执行 `auth` 与 `smoke`，覆盖认证与核心入口

### AC-4：无用脚本已删除

- **Given**：查看 `e2e/scripts/`
- **When**：列出脚本
- **Then**：仅保留 `auth.sh`、`smoke.sh`，不再保留各模块 chat 入口

## 技术说明

- `e2e/lib/helpers.sh` 只封装确定性 agent-browser 命令。
- `e2e/run.sh` 默认运行 `auth` 与 `smoke`。
- `e2e/scenarios/*.md` 仍保留为 VERIFY 参考，不由 `pnpm test:e2e` 自动执行。

## 实现记录

| 文件 | 改动说明 |
|------|----------|
| `e2e/lib/helpers.sh` | 移除 `ab_run_nl_scenario` 与 AI Gateway 依赖，保留确定性 helper |
| `e2e/scripts/auth.sh` | 改为确定性认证 E2E |
| `e2e/scripts/smoke.sh` | 新增核心入口 smoke |
| `e2e/scripts/*.sh` | 删除各模块 chat 薄入口 |
| `e2e/run.sh` | 默认只运行 `auth` 与 `smoke` |
| `e2e/README.md` | 更新为 VERIFY/TEST 分工说明 |
| `e2e/config.env.example` | 移除 AI Gateway 示例 |
| `workflow/history/README.md` | 更新历史补档与测试策略 |
| `workflow/history/FEATURE-INVENTORY.md` | 更新 VERIFY 场景与轻量 E2E 覆盖状态 |
| `package.json` | 增加 `test:e2e:smoke` |

## 确认

- [x] 验收标准已明确
- [x] 可以进入 CODE 阶段
