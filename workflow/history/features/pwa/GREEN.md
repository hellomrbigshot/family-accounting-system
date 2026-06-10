# GREEN — [追溯] PWA

> 状态：full-green

| 检查项 | 状态 | 备注 |
|--------|------|------|
| 功能已实现 | ✅ | 安装提示、更新提示 |
| 追溯 SPEC | ✅ | [SPEC.md](./SPEC.md) |
| VERIFY 场景 | ✅ | [pwa.md](../../../e2e/scenarios/pwa.md) |
| 稳定 E2E | ⬜ | 依赖浏览器 PWA / SW 环境，不纳入 `pnpm test:e2e` |
| workflow 文档完整 | ✅ | |

## 稳定 E2E 映射

| AC | 覆盖方式 |
|----|----------|
| — | 无稳定脚本覆盖 |

## 手动 VERIFY-only（永久）

| AC | 说明 |
|----|------|
| AC-1 安装提示 | 见 `pwa.md`；需支持 `beforeinstallprompt` 且未安装 |
| AC-2 更新提示 | 见 `pwa.md`；需部署新版本触发 SW 更新 |

改 PWA 相关代码时，按 `pwa.md` 在目标浏览器中手动 VERIFY。

## 结论

- [x] **full-green** — 追溯补档完成（手动 VERIFY-only，稳定 E2E 豁免）
