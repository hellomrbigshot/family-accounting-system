# Issue → PR 通用流程

当用户发送 GitHub Issue 链接并希望实现或修复时：

1. 解析 Issue：读取标题、描述、标签和验收标准。
2. 创建分支：按类型使用 `fix/issue-<number>`、`feat/issue-<number>` 或 `chore/issue-<number>`。
3. SPEC：将 Issue 转成 `workflow/current/SPEC.md`。
4. CODE：按 SPEC 实现。
5. VERIFY：用 agent-browser 或可用浏览器工具验证。
6. TEST：更新 [`e2e/TEST-CATALOG.md`](../e2e/TEST-CATALOG.md)，补充确定性断言，运行 `pnpm test:e2e`。
7. Review：检查边界、风险、无关改动。
8. GREEN：按 [`workflow/ARCHIVE-CHECKLIST.md`](../workflow/ARCHIVE-CHECKLIST.md) 归档到 `workflow/history/features/<模块>/`，运行 `bash workflow/scripts/reset-current.sh`。
9. Commit / PR：用户要求时提交、推送并创建 PR（PR 模板含归档自检）。

## GitHub CLI

优先使用：

```bash
gh issue view <number>
gh pr create
```

如果 `gh` 未登录或无权限，说明阻塞原因，并保留已完成的本地改动。

## 分支与提交

- Bug：`fix/issue-<number>`
- 功能：`feat/issue-<number>`
- 维护：`chore/issue-<number>`

commit message 使用中文，常用前缀：

- `feat:`
- `fix:`
- `chore:`
- `style:`
- `docs:`
- `test:`

提交前确认只暂存本次任务相关文件。
