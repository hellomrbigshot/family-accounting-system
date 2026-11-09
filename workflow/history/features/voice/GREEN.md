# GREEN — 语音识别能力与标签候选修复

> 状态：GREEN（代码及约定检查通过；未复现用户正式环境的个别漏选请求）

日期：2026-11-09。分支：codex/fix-voice-asr-tags，基于最新 origin/main。

## 验证结果

| 检查 | 结果 |
|------|------|
| SPEC / CODE | [SPEC.md](./SPEC.md)，只修改语音候选/输出预算及对应测试 |
| VERIFY | [voice.md](../../../../e2e/scenarios/voice.md)，iPhone 15 表单及真实授权 API 测试 |
| TEST | `pnpm test:e2e`（auth + smoke + voice-tags）全部通过 |
| 后端回归 | `pnpm --filter family-accounting-system-backend test -- --runInBand`：4 suites / 19 tests |
| 构建 | `pnpm build` 通过，仅已有 Browserslist 提示 |
| 代码检查 | `git diff --check` 通过；无新增业务 bridge；无私有配置、密钥改动 |

## AC 映射

| AC | 覆盖 |
|----|------|
| AC-1 ASR 范围 | verify-only：当前用户 Key 在 Step Plan 下 2.5 ASR 成功、3 ASR Max 无权限；普通接口额度不足；不只依赖模型目录 |
| AC-2 旧标签与语义匹配 | automated：`voice.test.ts`、`parseExpense.test.ts`、`voice-tags.sh`；真实模型另用授权候选验证 |
| AC-3 日期/房间/归档边界 | automated：`voice.test.ts`、`resolveTags.test.ts` |
| AC-4 表单预填与更改 | automated：默认 E2E 的 `voice-tags.sh` 首次/重录/取消 |
| AC-5 输出截断 | automated：`parseExpense.test.ts` 拒绝 length 响应；真实历史日期 4096 预算复测成功 |

## 正式列表测试与限制

用户本轮明确授权 8 个正式候选：9/9 场景符合预期。茶百道/库迪均匹配「奶茶咖啡」并映射正确 ID；北京/新疆历史旅行场景能同时匹配旅行与饮品；停车、高速、备婚、赡养、送礼结果符合预期。

茶百道/库迪用原 1024 token、按当天过滤出的 4 个普通候选也通过。说明这两句内容的模型语义能力正常，不能声称已复现其生产漏选。正式 8 个 ID 在本地库不存在，无法判断生产原始 BSON 是否缺 archived；接口/Mongoose 默认值与原始字段存在性必须区分。

本次已修复的确定问题：旧标签 archived:false 查询漏选、历史限时标签按今天过滤、复杂日期输出截断。没有修改 autoApply 的含义，没有硬编码品牌词典。测试不创建账单，未修改本地 Key。

探索记录：[VERIFY-LOG.md](../../VERIFY-LOG.md)。截图：`e2e/artifacts/voice-tags.png`（不提交）。归档后 current 重置为空白模板。

## 合成录音端到端补测

使用当前 2.5 ASR、用户授权的正式候选与真实文本解析：

| 合成录音 | 实际 ASR 文本 | 金额 | 标签 |
|----------|---------------|------|------|
| 茶百道消费十元 | 茶百道消费 10 元 | 10 | 奶茶咖啡，ID 与用户提供一致 |
| 库迪消费十元 | 库迪消费 10 元 | 10 | 奶茶咖啡，ID 与用户提供一致 |

两段均通过。真实麦克风/生产失败请求仍未复现；本结果确认当前模型链路具备识别这两个品牌并回填该标签的能力。

## 独立代码审查

2026-11-09 按用户要求新建独立 review 对话（01a1be0a-77e7-7ee3-b012-fce5c8b023a8），只读审查完整差异和新增文件。结论：**no findings**，未发现需要修复的可行动问题。

审查对话独立通过后端 4 suites / 19 tests、后端 TypeScript、Shell 语法和 git diff --check。审查未调用外部 AI API；浏览器结果由实现对话验证，真实模型测试与接口回放的验证边界已明确。
