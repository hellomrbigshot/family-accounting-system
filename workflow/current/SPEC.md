# SPEC — 验收标准

> 状态：🔄 进行中

## 基本信息

| 字段 | 内容 |
|------|------|
| 任务名称 | MiMo → 阶跃星辰 StepFun 迁移 |
| 类型 | refactor |
| 关联 Issue | — |
| 创建日期 | 2026-09-28 |
| 负责人 | AI |

## 背景与目标

小米 MiMo API 已过期，语音记账（ASR + 口语解析）不可用。迁移到阶跃星辰 Step Plan，保持现有语音记账产品能力不变。

## 范围

### 包含

- 后端 AI 客户端从 MiMo 替换为 StepFun（鉴权、Base URL、模型）
- 文本记账解析：`chat/completions` + `step-3.5-flash`
- 语音识别：`audio/asr/sse` + `stepaudio-2.5-asr`
- 环境变量、PM2、CI 部署 secrets 映射更新

### 不包含

- 前端录音 UI 改动
- TTS / realtime / 图像模型接入
- GitHub Secrets 实际值写入（需人工在仓库设置）

## 验收标准

### AC-1：文本解析走 StepFun

- **Given**：配置了 `STEPFUN_API_KEY` / `STEPFUN_BASE_URL` / `STEPFUN_MODEL`
- **When**：调用 `parseExpenseText` 解析口语记账文本
- **Then**：返回结构化金额/分类/日期/标签等字段，不再依赖任何 `MIMO_*` 环境变量

### AC-2：语音识别走 StepFun ASR SSE

- **Given**：前端上传 16kHz WAV 录音
- **When**：调用 `transcribeAudio`
- **Then**：通过 Step Plan `/audio/asr/sse` 得到识别文本；失败时返回可读错误

### AC-3：部署与本地配置可切换

- **Given**：开发者或 CI 按 `.env.example` / workflow 配置 `STEPFUN_*`
- **When**：启动后端或部署
- **Then**：`ecosystem.config.js` 与 `build-and-deploy.yml` 注入 StepFun 变量；文档示例不再出现 MiMo

## 技术说明

- Base URL：`https://api.stepfun.com/step_plan/v1`
- 鉴权：`Authorization: Bearer <key>`（与 MiMo 的 `api-key` 头不同）
- ASR 与 Chat 是不同路径；Step Plan 下 ASR 仅支持 SSE
- 默认模型：`STEPFUN_MODEL=step-3.5-flash`，`STEPFUN_ASR_MODEL=stepaudio-2.5-asr`
- 密钥不得提交进 git

## 实现记录（CODE 阶段填写）

| 文件 | 改动说明 |
|------|----------|
| `backend/src/services/stepfun/client.ts` | StepFun Chat 客户端（Bearer 鉴权） |
| `backend/src/services/stepfun/asr.ts` | ASR SSE 识别 |
| `backend/src/services/stepfun/parseExpense.ts` | 口语记账 JSON 解析 |
| `backend/src/controllers/voice.ts` | 改引用 stepfun |
| `backend/src/services/mimo/*` | 已删除 |
| `backend/.env.example` | `STEPFUN_*` 变量 |
| `ecosystem.config.js` | PM2 注入 StepFun |
| `.github/workflows/build-and-deploy.yml` | CI secrets 改为 STEPFUN_* |
| `e2e/TEST-CATALOG.md` | 登记本迁移 AC |

## 确认

- [x] 验收标准已与需求方/用户确认
- [x] 可以进入 CODE 阶段
