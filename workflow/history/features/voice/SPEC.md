# SPEC — 语音记账识别与标签回填

> source: bugfix | 日期：2026-11-09 | 分支：codex/fix-voice-asr-tags

## 背景与范围

调查现有 Key 的最佳可用 ASR，修复语音标签候选过滤。只处理语音记账链路，不改私有配置、供应商、标签字段含义或无关功能。

## 验收标准

### AC-1：确认 ASR 可用范围

根据官方文档及当前用户提供 Key 的实际请求确认可用模型；保留已可调用的 2.5 ASR。区分模型目录、Step Plan 权限与普通 API 余额，不记录密钥。

### AC-2：旧标签与语义匹配

未归档的普通标签即使没有 archived/type/autoApply 字段，也进入 AI 候选。AI 可根据消费语义返回多个既有标签，正确映射到 ID；无相关标签时为空，不创建标签。autoApply=false 不禁止 AI 语义匹配。

### AC-3：消费日期与标签边界

在消费日期解析前保留未归档的限时标签；解析后按消费日期校验有效期。已归档、其他房间、无匹配及日期范围外的标签不能回填。

### AC-4：表单自动选中与更改

首次语音结果自动选中返回的标签；重录后替换为新结果；用户可手动取消。沿用已有前端回填逻辑。

### AC-5：识别输出截断处理

日期和多标签推断保留足够输出额度；模型因 token 上限截断时，返回明确重试提示，不接受不完整结果。

## 实现记录

| 文件 | 内容 |
|------|------|
| backend/src/services/voice/resolveTags.ts | archived:$ne:true 兼容旧数据；未确定消费日期时保留限时候选 |
| backend/src/controllers/voice.ts | 取消今天的候选日期过滤；解析与候选使用同一 today 上下文 |
| backend/src/services/stepfun/parseExpense.ts | 输出上限提高为 4096，拒绝 length 截断响应 |
| backend/src/services/stepfun/client.ts | 声明响应 finish_reason |
| backend/src/controllers/voice.test.ts | 控制器到标签 resolver/校验的回归，模拟 Mongo 旧字段语义 |
| backend/src/services/voice/resolveTags.test.ts | 查询条件与历史有效期测试 |
| backend/src/services/stepfun/parseExpense.test.ts | 多标签规范化、空标签、截断处理 |
| frontend/src/components/ExpenseForm.vue | 仅增加标签字段 data-testid |
| e2e/fixtures/voice-recorder.js | 独立浏览器用合成麦克风 |
| e2e/scripts/voice-tags.sh、e2e/run.sh | 加入首次预填、重录替换、手动取消的确定性守门 |

## 数据核查与边界

原始数据全库有 14 条缺少 archived；配置的测试房间只有 1 条，未归档候选由 12 增至 13。用户提供的正式列表 8 个 ID 在本地库中均不存在，不能把测试房间统计当作正式库事实。正式列表经模型实测：茶百道/库迪均正确匹配奶茶咖啡，原先 1024 token 参数也通过。API/Mongoose 会补默认字段，接口返回 archived:false 不能证明底层存在该字段；生产漏选是否由旧字段引起，仍需生产原始记录或失败请求确认。
