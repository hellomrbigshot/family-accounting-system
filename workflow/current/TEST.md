# TEST — E2E 测试（agent-browser）

> 状态：✅ 完成

## 测试环境

| 字段 | 内容 |
|------|------|
| 测试工具 | agent-browser 确定性命令 |
| 脚本目录 | `e2e/scripts/` |
| 运行命令 | `pnpm test:e2e` / `pnpm test:e2e auth` / `pnpm test:e2e smoke` |

## 场景映射

| 场景 ID | 对应 AC | 脚本/场景 | 描述 | 状态 |
|---------|---------|-----------|------|------|
| E2E-1 | AC-1 | `e2e/README.md` / `workflow/history/README.md` | VERIFY / TEST 分工说明 | ✅ |
| E2E-2 | AC-2 | `e2e/scripts/*.sh` | 确定性脚本不依赖 AI Gateway | ✅ |
| E2E-3 | AC-3 | `e2e/scripts/auth.sh` / `e2e/scripts/smoke.sh` | 认证与核心入口守门 | ✅ |
| E2E-4 | AC-4 | `e2e/scripts/` | 删除模块 chat 入口，仅保留 auth/smoke | ✅ |

## 测试数据

默认账号见 `e2e/config.env.example`。

## 运行记录

| 运行时间 | 命令 | 结果 | 备注 |
|----------|------|------|------|
| 2026-06-09 | `bash -n e2e/run.sh e2e/lib/helpers.sh e2e/scripts/*.sh` | pass | shell 语法检查通过 |
| 2026-06-09 | `pnpm test:e2e` | pass | `auth` 与 `smoke` 均通过；不依赖 AI Gateway |

## 结论

- [x] `pnpm test:e2e` 通过
- [x] 可进入 GREEN 阶段
