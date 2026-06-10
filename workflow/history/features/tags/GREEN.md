# GREEN — [追溯] 标签

> 状态：full-green

| 检查项 | 状态 | 备注 |
|--------|------|------|
| 功能已实现 | ✅ | 普通 / 限时 / 归档标签 |
| 追溯 SPEC | ✅ | [SPEC.md](./SPEC.md) |
| VERIFY 场景 | ✅ | [tags.md](../../../e2e/scenarios/tags.md) |
| 稳定 E2E | ✅ | `e2e/scripts/smoke.sh`（分类页「标签管理」段） |
| workflow 文档完整 | ✅ | |

## 稳定 E2E 映射

| AC | 覆盖方式 |
|----|----------|
| AC-1 普通标签（入口） | `smoke.sh` 断言「标签管理」 |

## VERIFY-only

| AC | 说明 |
|----|------|
| AC-1 普通标签 CRUD | 见 `tags.md` |
| AC-2 限时标签 | 见 `tags.md` |
| AC-3 归档标签 | 见 `tags.md` |

## 结论

- [x] **full-green** — 追溯补档完成
