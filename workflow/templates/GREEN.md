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

## 最终检查清单

- [ ] SPEC 每条验收标准（AC-*）均已满足
- [ ] VERIFY 检查清单全部勾选
- [ ] E2E 测试全部通过（`pnpm test:e2e` 绿色）
- [ ] 无新增 TypeScript / lint 错误
- [ ] 未引入与任务无关的代码变更
- [ ] commit message 符合规范（中文，如 `feat:` / `fix:`）

## 结论

- [ ] **GREEN — 任务完成**，可合并/交付
- [ ] 未通过（阻塞项）：
