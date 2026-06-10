# 历史功能 VERIFY 记录

| 字段 | 内容 |
|------|------|
| 执行时间 | 2026-06-10 13:59:10 +0800 |
| 工具 | agent-browser + DEV E2E bridge |
| 脚本 | `e2e/scripts/verify-history.sh` |

## 汇总

- 通过：**29**
- 失败：**0**
- 跳过：**0**
- 条件/部分：**2**

### 通过
- auth AC-2 错误密码停留登录页
- auth AC-3 注册成功
- auth AC-1 登录成功
- home AC-1 本月总览
- home AC-3 最近支出
- home AC-4 快捷入口
- budget AC-1 打开预算弹窗
- budget AC-2 保存预算
- expenses AC-1 列表入口
- expenses AC-2 新增支出
- expenses AC-4 搜索
- expenses AC-5/6 日期 query
- expenses AC-3 编辑
- expenses AC-3 删除
- filters AC-1 创建筛选器
- filters AC-2 应用筛选器
- filters AC-3 清除筛选
- calendar AC-1 日历页
- calendar AC-2 跳转支出列表
- categories AC-2 新建
- categories AC-2 编辑
- categories AC-2 删除
- tags AC-1 普通标签
- tags AC-2 限时标签
- tags AC-3 归档标签
- reports AC-2 图表/统计区域
- pwa AC-1 安装提示
- pwa AC-2 更新提示
- auth AC-4 退出登录

### 条件/部分
- home AC-2 超预算展示（当月未超预算，条件未满足）
- reports AC-3 加载态（加载过快，未捕获骨架屏）

## 说明

- 复杂流程通过 `window.__FAS_E2E__`（仅 DEV，handler 见 `frontend/src/e2e/handlers.ts`）走 store/API。
- 原 9 项跳过 AC 已纳入本脚本。
