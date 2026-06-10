# 项目与编码规则

## 技术栈

- 前端：Vue 3、Vue Router、Pinia、Vant、Tailwind CSS、Dayjs、ECharts
- 后端：Express、MongoDB / Mongoose、JWT、bcryptjs
- 包管理器：pnpm
- Node：本地使用 nvm 管理，项目使用 Node 22，不要重复安装 Node
- 应用形态：移动端优先的 PWA

## 代码风格

- JS/TS 代码不写分号。
- 优先遵循项目现有写法，不主动引入新框架或新架构。
- Vue 组件优先使用 `<script setup lang="ts">`。
- 优先使用 Vant 组件和 Tailwind CSS，减少额外 CSS。
- 单组件建议不超过 200 行，单文件不超过 500 行；超过时先说明拆分方案。
- 代码是写给人看的，只是机器恰好可以运行。

## 自动导入约定

项目已配置自动导入。生成代码时不要为以下常用 API 添加重复 import：

- Vue Composition API：`ref`、`reactive`、`computed`、`watch`、`onMounted` 等
- Vue Router：`useRouter`、`useRoute` 等
- Pinia：`defineStore`、`storeToRefs` 等
- Vant 常用组件与函数：`showToast`、`showDialog`、`showConfirmDialog` 等
- 已配置的常用库：`axios`、`dayjs` 等

自定义组件、类型定义、项目工具函数仍按需显式 import。

## 修改原则

- 只修改与用户需求直接相关的代码。
- 不主动重构无关代码。
- 不扩大范围，不顺手修无关问题。
- 发现工作区已有未提交改动时，默认认为是用户改动，不要回滚。
- 修改前先理解现有代码结构、数据流、状态管理和 API 影响。
- 当存在多个可行方案且取舍明显时，先说明方案与建议，再实现用户确认的方向。
- 不提交密钥、token、本地私有配置或 `e2e/config.env`。

## Tailwind / UI 约定

- 移动端优先。
- 优先使用项目主题色与现有间距体系。
- 交互元素要有明确 hover / focus / active 状态。
- 不为了视觉效果引入过重装饰。
- Vant 表单、弹窗、选择器优先沿用项目现有模式。
