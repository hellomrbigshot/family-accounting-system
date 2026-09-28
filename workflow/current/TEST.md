# TEST — E2E 测试（agent-browser）

> 状态：✅ 完成

> 前置：VERIFY 阶段全部通过

## 测试环境

| 字段 | 内容 |
|------|------|
| 测试工具 | [agent-browser](https://agent-browser.dev/) |
| 脚本目录 | `e2e/scripts/` |
| AC 映射 | [`e2e/TEST-CATALOG.md`](../../e2e/TEST-CATALOG.md) |
| 运行命令 | `pnpm test:e2e` / `pnpm test:e2e auth` / `pnpm test:e2e smoke` |

## 本任务 AC 映射（必填）

| AC | 脚本 / 断言 | 类型 | 状态 |
|----|-------------|------|------|
| AC-1 文本解析 StepFun | curl 冒烟（VERIFY） | verify-only（依赖外部付费 API Key，不适合 CI/E2E 固化） | ✅ |
| AC-2 语音 ASR SSE | curl SSE 冒烟（VERIFY） | verify-only（同上） | ✅ |
| AC-3 配置切换 | 静态检查 workflow/env | verify-only（配置类，无 UI 断言） | ✅ |

## 运行记录

本次为供应商替换，未新增浏览器 E2E。既有 `resolveTags.test.ts`（标签解析，不依赖供应商）保持有效。

| 运行时间 | 命令 | 结果 | 备注 |
|----------|------|------|------|
| 2026-09-28 | `cd backend && pnpm exec tsc --noEmit` | pass | |
| 2026-09-28 | StepFun chat/completions 冒烟 | pass | |
| 2026-09-28 | StepFun audio/asr/sse 冒烟 | pass | |

## 结论

- [x] TEST-CATALOG 已更新
- [x] AC 均为 verify-only 并写明原因（外部 API，不宜 automated）
- [ ] `pnpm test:e2e`：本次不强制（无前端行为变更）
- [x] 可进入 GREEN 阶段
