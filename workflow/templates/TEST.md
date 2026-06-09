# TEST — E2E 测试（agent-browser）

> 状态：⬜ 待办 | 🔄 进行中 | ✅ 完成

> 前置：VERIFY 阶段全部通过

## 测试环境

| 字段 | 内容 |
|------|------|
| 测试工具 | [agent-browser](https://agent-browser.dev/) |
| 脚本目录 | `e2e/scripts/` |
| 复杂步骤 | `e2e/scenarios/` |
| 运行命令 | `pnpm test:e2e` / `pnpm test:e2e <模块>` |

## 场景映射

| 场景 ID | 对应 AC | 脚本/场景 | 描述 | 状态 |
|---------|---------|-----------|------|------|
| E2E-1 | AC-1 | `e2e/scripts/xxx.sh` | | ⬜ |
| E2E-2 | AC-2 | `e2e/scenarios/xxx.md` | | ⬜ |

## 测试数据

<!-- 默认账号见 e2e/config.env.example -->

## 运行记录

```bash
pnpm test:e2e              # 全部
pnpm test:e2e auth         # 单模块

# 调试（token 友好）
agent-browser snapshot -i
agent-browser find placeholder "..." fill "..."
```

| 运行时间 | 命令 | 结果 | 备注 |
|----------|------|------|------|
| | | pass / fail | |

## 结论

- [ ] 所有 E2E 场景已编写或引用 scenarios
- [ ] `pnpm test:e2e` 通过
- [ ] 可进入 GREEN 阶段
- [ ] 未通过，需回到 CODE → VERIFY → TEST
