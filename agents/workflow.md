# 五阶段开发工作流

本项目功能开发、Bug 修复、重要重构默认遵循：

```text
SPEC → CODE → VERIFY → TEST → GREEN
```

对应文档位于 `workflow/current/`：

| 阶段 | 目标 | 文档 |
|------|------|------|
| SPEC | 明确做什么、怎么算完成 | `workflow/current/SPEC.md` |
| CODE | 按 SPEC 实现功能 | 源码 + SPEC 实现记录 |
| VERIFY | 浏览器视觉/交互确认 | `workflow/current/VERIFY.md` |
| TEST | 稳定自动化测试 | `workflow/current/TEST.md` |
| GREEN | 全部通过，任务完成 | `workflow/current/GREEN.md` |

## SPEC

收到新需求、Issue 或 Bug 报告后：

- 填写 `workflow/current/SPEC.md`
- 写清背景、范围、不包含事项、可验证验收标准
- 验收标准使用 Given/When/Then 或编号清单
- 需求不清时先问清楚，不要带着模糊目标写代码

## CODE

SPEC 确认后：

- 只改与 SPEC 直接相关的代码
- 遵循项目现有规范
- 在 SPEC 的「实现记录」登记改动文件与要点
- 完成语法、类型、本地可运行等自检

## VERIFY

CODE 完成后：

- 启动本地应用，通常执行 `pnpm dev`
- 前端默认地址：`http://localhost:5180`
- 使用 agent-browser 或其他可用浏览器工具按 SPEC 逐项验证
- 检查页面展示、交互流程、控制台错误、移动端/PWA 表现
- 结果写入 `workflow/current/VERIFY.md`

## TEST

VERIFY 通过后：

```bash
pnpm test:e2e
```

- 当前 `pnpm test:e2e` 默认运行 `e2e/scripts/auth.sh` 与 `e2e/scripts/smoke.sh`
- 不依赖 `agent-browser chat` 或 AI Gateway
- 复杂流程优先放在 VERIFY 场景中按需求专项验证
- 结果写入 `workflow/current/TEST.md`

## GREEN

VERIFY 和 TEST 都通过后：

- 填写 `workflow/current/GREEN.md`
- 确认 SPEC 每条 AC 已满足
- 确认 `pnpm test:e2e` 绿色
- 确认没有无关改动和新增类型/语法问题

GREEN 是任务完成标准，不跳过阶段。

## 新任务启动

```bash
cp workflow/templates/SPEC.md workflow/current/SPEC.md
cp workflow/templates/VERIFY.md workflow/current/VERIFY.md
cp workflow/templates/TEST.md workflow/current/TEST.md
cp workflow/templates/GREEN.md workflow/current/GREEN.md
```

## 历史功能补档

历史功能文档位于 `workflow/history/`：

| 用途 | 路径 |
|------|------|
| 补档指南 | `workflow/history/README.md` |
| 功能清单 | `workflow/history/FEATURE-INVENTORY.md` |
| 模块追溯 SPEC / GREEN | `workflow/history/features/` |
| VERIFY 自然语言场景 | `e2e/scenarios/` |
| 稳定 E2E 脚本 | `e2e/scripts/` |

补档原则：

- 从现有代码反向写追溯 SPEC，标记 `source: retroactive`
- 不与 `workflow/current/` 混用
- 新功能完成后，可将 `workflow/current/` 归档到 `workflow/history/features/<模块>/` 或子目录
