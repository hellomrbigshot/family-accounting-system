# E2E 测试（agent-browser）

项目采用轻量 E2E 策略（[方案 A 对齐 Viking 流程](https://vikingz.me/ai-e2e/)）：

- [`TEST-CATALOG.md`](TEST-CATALOG.md)：**AC → VERIFY / TEST 映射**（主索引）
- `e2e/scenarios/*.md`：VERIFY 阶段自然语言步骤（AC 定义在 `workflow/history/features/`）
- `e2e/scripts/*.sh`：确定性 agent-browser 脚本，供 TEST 阶段执行

`pnpm test:e2e` 不依赖 `agent-browser chat`，也不需要 AI Gateway。

## 首次安装

```bash
pnpm install
pnpm test:e2e:install
cp e2e/config.env.example e2e/config.env   # 可选，改测试账号/地址
```

## 运行

前提：本地已启动 `pnpm dev`，前端默认 `http://localhost:5180`。

```bash
pnpm test:e2e        # auth + smoke（单功能完成）
pnpm test:e2e auth   # 认证专项
pnpm test:e2e smoke  # 核心入口 smoke
bash e2e/scripts/verify-history.sh  # 发版前 / 大重构
```

## 当前覆盖

`auth.sh` 覆盖：

- 错误密码停留登录页
- 正确登录进入首页
- 退出登录回到登录页

`smoke.sh` 覆盖：

- 首页、本月总览、最近支出
- 支出页（含 AC-7 统计徽章 `总计 · N 笔`）
- 日历页
- 分类/标签页
- 报表页
- 更多页
- 预算弹窗可打开

复杂流程见 [`TEST-CATALOG.md`](TEST-CATALOG.md) 中的 **verify-only** 条目。

## 目录结构

```text
e2e/
├── TEST-CATALOG.md         # AC → VERIFY / TEST 映射（主索引）
├── config.env.example
├── config.env              # 本地配置，已 gitignore
├── run.sh                  # E2E 入口
├── lib/helpers.sh          # agent-browser 命令封装
├── scripts/
│   ├── auth.sh             # 确定性认证测试
│   ├── smoke.sh            # 确定性核心入口测试
│   └── verify-history.sh   # 历史功能全量 VERIFY（含原跳过 AC）
├── scenarios/              # VERIFY 阶段自然语言参考
└── artifacts/              # 截图输出，已 gitignore
```

## VERIFY 阶段

需要探索式验证时，可以直接用 agent-browser：

```bash
agent-browser open http://localhost:5180/login
agent-browser snapshot -i
agent-browser errors
```

也可以读取 `e2e/scenarios/<模块>.md`，按自然语言步骤操作并记录到 `workflow/current/VERIFY.md`。

全量历史 VERIFY 可一键执行：

```bash
bash e2e/scripts/verify-history.sh
```

结果写入 `workflow/history/VERIFY-LOG.md`。

### DEV E2E bridge（仅 VERIFY）

开发模式暴露 `window.__FAS_E2E__.invoke(handler, ...args)`。handler **集中**在 `frontend/src/e2e/handlers.ts`，禁止散落到 Vue 组件。规则见 [agents/e2e-bridge.md](../agents/e2e-bridge.md)。

`pnpm test:e2e` 守门脚本不使用 bridge。

## 环境变量

| 变量 | 默认 | 说明 |
|------|------|------|
| `E2E_BASE_URL` | `http://localhost:5180` | 前端地址 |
| `E2E_ROOM_NUMBER` | `888888` | 测试房间号 |
| `E2E_PASSWORD` | `123456` | 测试密码 |
| `E2E_DEVICE` | `iPhone 15` | 移动端设备模拟 |
