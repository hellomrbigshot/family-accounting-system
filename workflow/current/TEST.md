# TEST — E2E 测试（agent-browser）

> 状态：⬜ 待办 | 🔄 进行中 | ✅ 完成

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
| AC-1 | | automated / smoke / verify-only | ⬜ |

**要求**：至少 1 条 AC 为 **automated**（在 `auth.sh` / `smoke.sh` 或新建 `e2e/scripts/<模块>-issue-<N>.sh`）；其余若 verify-only 须写原因。

完成后同步更新 [`e2e/TEST-CATALOG.md`](../../e2e/TEST-CATALOG.md)。

## 运行记录

```bash
pnpm test:e2e
pnpm test:e2e smoke
```

| 运行时间 | 命令 | 结果 | 备注 |
|----------|------|------|------|
| | | pass / fail | |

## 结论

- [ ] TEST-CATALOG 已更新
- [ ] 至少 1 条 automated 断言已添加
- [ ] `pnpm test:e2e` 通过
- [ ] 可进入 GREEN 阶段
