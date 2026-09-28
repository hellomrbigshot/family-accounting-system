# GREEN — 完成归档

> 状态：✅ 完成（已提交并开 PR）

## 基本信息

| 字段 | 内容 |
|------|------|
| 任务 | MiMo → 阶跃星辰 StepFun 迁移 |
| 分支 | `feat/stepfun-replace-mimo` |
| 完成日期 | 2026-09-28 |

## 交付摘要

- 语音记账后端供应商从 MiMo 切换为 StepFun Step Plan
- Chat 解析默认 `step-3.5-flash`；ASR 默认 `stepaudio-2.5-asr`
- 配置项：`STEPFUN_API_KEY` / `STEPFUN_BASE_URL` / `STEPFUN_MODEL` / `STEPFUN_ASR_MODEL`

## 上线注意

1. GitHub Secrets 需新增 `STEPFUN_*`，旧 `MIMO_*` 可删除
2. 服务器环境变量同步更新后 `pm2 reload`
3. 密钥勿提交仓库；聊天中暴露过的 key 建议在控制台轮换

## 检查

- [x] SPEC / VERIFY / TEST 已填写
- [x] TEST-CATALOG 已登记
- [x] 已提交并开 PR
