# GREEN — 全通过确认

> 状态：⬜ 待办 | 🔄 进行中 | ✅ 完成

> 前置：SPEC、CODE、VERIFY、TEST 全部完成

## 任务摘要

| 字段 | 内容 |
|------|------|
| 任务名称 | |
| 完成日期 | |
| 分支名 | |
| PR 链接 | |

## 阶段回溯

| 阶段 | 文档 | 状态 | 备注 |
|------|------|------|------|
| SPEC | workflow/current/SPEC.md | ⬜ | |
| CODE | SPEC 实现记录 | ⬜ | |
| VERIFY | workflow/current/VERIFY.md | ⬜ | |
| TEST | workflow/current/TEST.md | ⬜ | |

## AC 测试映射（必填）

<!-- 复制到 e2e/TEST-CATALOG.md 对应模块；每条 AC 一行 -->

| AC | TEST 断言 / 脚本 | 类型 |
|----|------------------|------|
| AC-1 | | automated / smoke / verify-only |
| AC-2 | | |

类型说明见 [`e2e/TEST-CATALOG.md`](../../e2e/TEST-CATALOG.md)。

## 最终检查清单

- [ ] SPEC 每条 AC 在 TEST-CATALOG 有登记（automated 或 verify-only + 原因）
- [ ] 至少 1 条与本任务相关的 **automated** 断言已加入 `e2e/scripts/`
- [ ] VERIFY 检查清单全部勾选
- [ ] `pnpm test:e2e` 通过
- [ ] 无新增 TypeScript / lint 错误
- [ ] 未引入与任务无关的代码变更
- [ ] 已按 [ARCHIVE-CHECKLIST.md](../ARCHIVE-CHECKLIST.md) 归档到 `workflow/history/features/<模块>/`
- [ ] `workflow/current/` 已重置（`bash workflow/scripts/reset-current.sh`）

## 结论

- [ ] **GREEN — 任务完成**，可合并/交付
- [ ] 未通过（阻塞项）：
