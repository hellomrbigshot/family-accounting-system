# AI 协作入口

本文件是项目唯一的 AI 入口规则，适用于各类 AI 编程助手。详细规则放在根目录 `agents/` 中，不依赖任何编辑器私有规则目录。

## 必须遵守

- 默认按 **SPEC → CODE → VERIFY → TEST → GREEN** 执行新功能、Bug 修复和重要重构。
- 只修改与用户需求直接相关的代码，不主动重构无关代码。
- 发现工作区已有未提交改动时，默认认为是用户改动，不要回滚。
- 不提交密钥、token、本地私有配置或 `e2e/config.env`。
- VERIFY 使用 agent-browser 或可用浏览器工具做探索式验证。
- TEST 使用确定性 E2E：`pnpm test:e2e`；新功能至少为每条 AC 在 [e2e/TEST-CATALOG.md](e2e/TEST-CATALOG.md) 登记 **automated** 或 **verify-only**（含原因）。
- commit message 使用中文，提交前只暂存本次任务相关文件。
- GREEN 归档见 [workflow/ARCHIVE-CHECKLIST.md](workflow/ARCHIVE-CHECKLIST.md)；PR 使用 [.github/pull_request_template.md](.github/pull_request_template.md)。

## E2E 运行策略

| 时机 | 命令 |
|------|------|
| 单功能完成 | `pnpm test:e2e` |
| 发版前 / 大重构 | `pnpm test:e2e` + `bash e2e/scripts/verify-history.sh` |

CI 不跑 E2E。AC 与脚本映射见 [e2e/TEST-CATALOG.md](e2e/TEST-CATALOG.md)。

## 规则索引

- [项目与编码规则](agents/coding-rules.md)
- [五阶段开发工作流](agents/workflow.md)
- [GREEN 归档检查清单](workflow/ARCHIVE-CHECKLIST.md)
- [VERIFY / TEST 测试规则](agents/testing.md)
- [E2E Bridge 规则（DEV VERIFY）](agents/e2e-bridge.md)
- [Issue → PR 通用流程](agents/issue-pr.md)
- [TEST 目录（AC 映射）](e2e/TEST-CATALOG.md)

## 常用命令

```bash
pnpm dev
pnpm build
pnpm test:e2e
pnpm test:e2e auth
pnpm test:e2e smoke
pnpm test:e2e:install
```

## 新任务启动

```bash
cp workflow/templates/SPEC.md workflow/current/SPEC.md
cp workflow/templates/VERIFY.md workflow/current/VERIFY.md
cp workflow/templates/TEST.md workflow/current/TEST.md
cp workflow/templates/GREEN.md workflow/current/GREEN.md
```

然后先填写 `workflow/current/SPEC.md`。
