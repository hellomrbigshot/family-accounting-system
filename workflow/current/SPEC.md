# SPEC — 验收标准

> 状态：✅ 完成

## 基本信息

| 字段 | 内容 |
|------|------|
| 任务名称 | 语音输入支持重新录制 |
| 类型 | feature |
| 关联 Issue | #49 |
| 创建日期 | 2026-08-07 |
| 负责人 | AI |

## 背景与目标

语音记账后，若 ASR 识别文字不符合预期，用户需要在表单内快速重新录制，而不必关闭表单后再次点击悬浮语音按钮。

## 范围

### 包含

- 在支出表单的「语音识别内容」区域增加「重新录制」按钮
- 点击后弹出录音 overlay，完成识别后更新表单字段与识别文字
- 抽取共用录音逻辑与 overlay 组件，避免重复代码

### 不包含

- 修改后端语音识别 API
- 手动编辑识别文字（用户仍可直接改表单字段）

## 验收标准

### AC-1：显示重新录制按钮

- **Given**：用户通过语音输入打开新增支出表单，且存在 `voiceRawText`
- **When**：查看表单顶部语音识别区域
- **Then**：识别文字旁显示「重新录制」按钮

### AC-2：重新录制更新内容

- **Given**：用户在语音预填的支出表单中
- **When**：点击「重新录制」，完成一次新的录音识别
- **Then**：识别文字与表单字段（日期、分类、金额、描述、标签、额外支出）更新为新识别结果

### AC-3：非语音场景不显示

- **Given**：用户通过「+」手动新增支出
- **When**：打开新增支出表单
- **Then**：不显示语音识别区域与重新录制按钮

## 技术说明

- 新增 `VoiceRecordingOverlay.vue`、`useVoiceExpenseRecording.ts`
- `ExpenseForm.vue` 增加 `voice-update` 事件与 `data-testid="voice-rerecord"`
- `Home.vue` 同步父级 voice 状态

## 实现记录（CODE 阶段填写）

| 文件 | 改动说明 |
|------|----------|
| `frontend/src/components/VoiceRecordingOverlay.vue` | 抽取录音 overlay UI |
| `frontend/src/composables/useVoiceExpenseRecording.ts` | 抽取录音+识别逻辑 |
| `frontend/src/components/VoiceRecordButton.vue` | 复用共用逻辑 |
| `frontend/src/components/ExpenseForm.vue` | 增加重新录制按钮与流程 |
| `frontend/src/views/Home.vue` | 处理 voice-update 事件 |

## 确认

- [x] 验收标准已与需求方/用户确认
- [x] 可以进入 CODE 阶段
