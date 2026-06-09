# Issue → 实现 → 验证 → PR 通用说明

当你把 GitHub Issue 链接发给 AI，并希望它实现功能、修复 Bug 或创建 PR 时，统一按根目录 `AGENTS.md` 中的通用流程执行。

本说明不依赖任何编辑器私有规则目录。

## 需要准备的工具

| 工具 | 用途 | 是否必须 |
|------|------|----------|
| GitHub CLI (`gh`) | 读取 Issue、创建 PR | 创建 PR 时必须 |
| agent-browser | 本地浏览器 VERIFY / E2E | 推荐 |
| pnpm / Node 22 | 本地开发与测试 | 必须 |

## GitHub CLI

安装并登录：

```bash
brew install gh
gh auth login
gh auth status
```

如果你希望在无交互环境使用 token，可以本机配置：

```bash
export GH_TOKEN="ghp_xxxxxxxxxxxxxxxxxxxx"
```

不要把 token 写入仓库文件。

## 本地验证工具

项目默认使用 agent-browser 做浏览器验证：

```bash
pnpm test:e2e:install
pnpm dev
pnpm test:e2e
```

VERIFY 阶段可以直接用：

```bash
agent-browser open http://localhost:5180
agent-browser snapshot -i
agent-browser errors
```

如果当前 AI 环境提供其他浏览器工具，也可以使用，但结果需要记录到 `workflow/current/VERIFY.md`。

## Issue 工作流

给 AI 发送 Issue 链接后，推荐按以下步骤执行：

1. 解析 Issue 内容与验收标准。
2. 创建任务分支，例如 `fix/issue-123` 或 `feat/issue-123`。
3. 写 `workflow/current/SPEC.md`，确认范围。
4. 实现代码并记录实现文件。
5. 用 agent-browser 做 VERIFY。
6. 运行 `pnpm test:e2e`。
7. 更新 `workflow/current/GREEN.md`。
8. 用户要求时提交、推送并创建 PR。

## 使用方式

示例：

```text
请按 AGENTS.md 工作流处理这个 issue：
https://github.com/<owner>/<repo>/issues/123
```

如果你希望 AI 完整执行到 PR，可以补充：

```text
SPEC 合理后可以继续实现、验证、测试，并创建 PR。
```

## 发布说明

本流程不改变现有发布机制。PR 合并到主分支后，仍按仓库已有 CI/CD 或部署流程执行。
