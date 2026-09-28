# VERIFY — 视觉确认

> 状态：✅ 完成

> 前置：CODE 阶段完成

## 验证环境

| 字段 | 内容 |
|------|------|
| 验证日期 | 2026-09-28 |
| 前端地址 | —（本次为后端 AI 供应商切换） |
| 后端地址 | StepFun API 直连冒烟 |
| 使用的工具 | curl / tsc |

## 检查清单

### V-1（对应 AC-1）

- [x] 操作步骤：调用 Step Plan `chat/completions`，`model=step-3.5-flash`，口语「今天午饭花了35块」
- [x] 预期界面/行为：返回可解析 JSON（金额/分类等）
- [x] 实际结果：HTTP 200，`amount=35`，`categoryName=餐饮`，`date=2026-09-28`
- [x] 控制台无报错：是
- [x] 截图/备注：`max_tokens` 需 ≥1024，否则 reasoning 占满导致 `content` 为空

### V-2（对应 AC-2）

- [x] 操作步骤：调用 Step Plan `audio/asr/sse`，上传 16kHz WAV
- [x] 预期界面/行为：SSE 返回 `transcript.text.done`
- [x] 实际结果：HTTP 成功，事件类型符合预期（测试音为纯正弦波，`text` 为空属正常）
- [x] 控制台无报错：是
- [x] 截图/备注：前端既有录音已是 16kHz WAV，与 ASR 格式匹配

### V-3（对应 AC-3）

- [x] 操作步骤：检查 `.env.example`、`ecosystem.config.js`、`build-and-deploy.yml`
- [x] 预期：均为 `STEPFUN_*`，无 `MIMO_*`
- [x] 实际结果：已替换

## 通用检查

- [x] 与 SPEC「不包含」范围无越界实现
- [x] `tsc --noEmit` 通过（backend）
- [ ] 移动端/PWA：不适用
- [ ] 浏览器控制台：端到端语音需本地登录后手动点一次录音验证

## 结论

- [x] 全部通过，可进入 TEST 阶段
- [ ] 未通过，需回到 CODE 修复（问题描述）：
