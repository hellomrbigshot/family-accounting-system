# GREEN — [追溯] 认证

> 状态：full-green

| 检查项 | 状态 | 备注 |
|--------|------|------|
| 功能已实现 | ✅ | 登录 / 注册 / 退出 |
| 追溯 SPEC | ✅ | [SPEC.md](./SPEC.md) |
| VERIFY 场景 | ✅ | [auth.md](../../../e2e/scenarios/auth.md) |
| 稳定 E2E | ✅ | `e2e/scripts/auth.sh` |
| workflow 文档完整 | ✅ | |

## 稳定 E2E 映射

| AC | 覆盖方式 |
|----|----------|
| AC-1 登录成功 | `auth.sh` |
| AC-2 登录失败 | `auth.sh` |
| AC-4 退出登录 | `auth.sh`（经 `ab_logout`） |

## VERIFY-only

| AC | 说明 |
|----|------|
| AC-3 注册 | 避免重复创建不可控账号，见 `e2e/scenarios/auth.md`「注册验证说明」，改注册相关代码时专项 VERIFY |

## 结论

- [x] **full-green** — 追溯补档完成
