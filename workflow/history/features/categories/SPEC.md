# SPEC — 验收标准 [追溯]

> source: retroactive | 页面：`/categories` 分类 Tab

## 验收标准

### AC-1：列表

- **Given**：已登录用户进入分类 Tab
- **When**：页面加载
- **Then**：展示用户分类列表（含系统预设分类）

### AC-2：新建 / 编辑 / 删除

- **When**：通过表单创建或修改分类（名称、图标等）
- **Then**：列表同步更新；被使用的分类删除时有合理提示

## 实现记录

`CategoryList.vue` `CategoryForm.vue` `stores/category.ts`
