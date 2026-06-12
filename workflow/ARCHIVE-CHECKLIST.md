# GREEN 归档检查清单

> GREEN 阶段最后一步：**合并进 history，重置 current**。  
> 不会自动执行；PR 合并前或 commit 前人工 / AI 按本清单操作。

## 何时必须归档

| 任务类型 | 合并 history SPEC/GREEN | 更新 TEST-CATALOG | 重置 current |
|----------|-------------------------|-------------------|--------------|
| 功能 / Bug（有模块 AC） | ✅ 必须 | ✅ 必须 | ✅ 必须 |
| 仅新增 automated 断言 | ✅ 更新 GREEN 映射即可 | ✅ 必须 | ✅ 必须 |
| 纯 chore（无模块 AC） | ⬜ 跳过 | ⬜ 若无断言变更可跳过 | ✅ 必须 |

## 四步归档

### 1. 合并 SPEC

编辑 `workflow/history/features/<模块>/SPEC.md`：

- 追加或更新 AC（保持 AC-1 … AC-N 连续编号）
- 在「实现记录」登记改动文件
- **不要**创建 `issue-<N>/` 子目录

### 2. 更新 GREEN

编辑 `workflow/history/features/<模块>/GREEN.md`：

- **automated**：写清 `auth.sh` / `smoke.sh` 或功能脚本中的断言
- **verify-only**：链接 `e2e/scenarios/<模块>.md` 步骤
- 可选：简短交付记录（Issue #、分支、日期）

### 3. 同步 TEST-CATALOG

编辑 [`e2e/TEST-CATALOG.md`](../e2e/TEST-CATALOG.md) 对应模块表格：

- 每条 AC 一行：`automated` / `smoke` / `verify-only`（verify-only 须能推断原因）
- 新功能至少 1 条 **automated**（或在 `e2e/scripts/` 新增断言）

### 4. 重置 current

```bash
bash workflow/scripts/reset-current.sh
```

将 `workflow/current/*` 恢复为空白模板，供下一任务使用。

## 可选

- [`workflow/history/VERIFY-LOG.md`](history/VERIFY-LOG.md) — 记录探索式 VERIFY 结果
- [`workflow/history/FEATURE-INVENTORY.md`](history/FEATURE-INVENTORY.md) — 更新模块 `test` 列
- [`e2e/scenarios/<模块>.md`](../e2e/scenarios/) — 仅 VERIFY 步骤（AC 定义仍在 history SPEC）

## AI 口令

GREEN 通过后对 AI 说：

> 按 `workflow/ARCHIVE-CHECKLIST.md` 归档到 `<模块>` history，并重置 current。

## 相关文档

- [五阶段工作流](../agents/workflow.md)
- [Issue → PR](../agents/issue-pr.md)
- [TEST 目录](../e2e/TEST-CATALOG.md)
