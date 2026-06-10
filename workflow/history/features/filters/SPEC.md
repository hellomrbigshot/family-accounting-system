# SPEC — 验收标准 [追溯]

> source: retroactive | 页面：支出页「筛选器」

## 验收标准

### AC-1：管理筛选器

- **Given**：用户在 `/expenses`
- **When**：打开筛选器管理
- **Then**：可创建、编辑、删除命名筛选条件（分类、标签、日期等组合）

### AC-2：应用筛选器

- **Given**：已保存筛选器
- **When**：选择某筛选器
- **Then**：列表按条件过滤；顶部显示当前筛选器名称；日期选择被忽略

### AC-3：清除筛选

- **When**：点击清除
- **Then**：恢复默认列表与日期筛选行为

## 实现记录

`FilterManager.vue` `FilterForm.vue` `stores/filter.ts` `backend/src/routes/filter.ts`
