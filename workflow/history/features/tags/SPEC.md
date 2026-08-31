# SPEC — 验收标准 [追溯]

> source: retroactive | 页面：`/categories` 标签 Tab

## 验收标准

### AC-1：普通标签

- **Given**：用户在标签 Tab
- **When**：新建普通标签并填写名称
- **Then**：标签出现在列表，可在支出表单中选择

### AC-2：限时标签

- **Given**：选择类型「限时」
- **When**：填写名称、开始/结束日期并保存
- **Then**：标签在有效期内可用于支出；列表展示有效期

### AC-3：归档标签

- **Given**：存在已过期或手动归档的限时标签
- **When**：查看列表或尝试用于新支出
- **Then**：归档标签有明确展示；校验逻辑符合业务规则（不可误用）

### AC-4：语音 AI tag 匹配（#52）

- **Given**：房间存在 tag「星巴克咖啡」，语音 AI 返回 tagNames 含「星巴克」
- **When**：后端 `resolveExpenseTagIds` 处理
- **Then**：匹配到「星巴克咖啡」并返回 id

- **Given**：存在已过期临时 tag
- **When**：构建语音 prompt 候选集（`getAvailableTagsForPrompt`）
- **Then**：不包含该过期 tag

## 实现记录

`TagList.vue` `TagForm.vue` `stores/tag.ts` | 近期：`161d446` 限时标签、`ffecc0e` 归档校验

| 文件 | 说明 |
|------|------|
| `backend/src/services/voice/resolveTags.ts` | fuzzy 匹配 + 日期过滤 prompt（#52） |
| `backend/src/services/mimo/parseExpense.ts` | 移除 tag 精确过滤（#52） |
| `backend/src/controllers/voice.ts` | prompt 使用当天日期过滤 tag（#52） |
| `backend/src/services/voice/resolveTags.test.ts` | 单元测试（#52） |
