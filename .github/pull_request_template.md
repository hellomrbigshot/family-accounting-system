## Summary

<!-- 1～3 条：做了什么、为什么 -->

Closes #

## 五阶段自检

- [ ] **SPEC** — `workflow/current/SPEC.md` 验收标准已满足
- [ ] **CODE** — 实现与 SPEC 一致，无无关改动
- [ ] **VERIFY** — `workflow/current/VERIFY.md` 已记录浏览器验证
- [ ] **TEST** — `e2e/TEST-CATALOG.md` 已更新，`pnpm test:e2e` 通过
- [ ] **GREEN** — 已完成 [history 归档](workflow/ARCHIVE-CHECKLIST.md)（见下）

## History 归档（GREEN 必做）

> 合并前完成；纯 chore 无模块 AC 可只重置 `current`。

- [ ] 新 AC 已合并进 `workflow/history/features/<模块>/SPEC.md`
- [ ] `workflow/history/features/<模块>/GREEN.md` 已更新（automated / verify-only）
- [ ] `e2e/TEST-CATALOG.md` 对应模块段已同步
- [ ] 如需：`workflow/history/VERIFY-LOG.md` 已追加验证记录
- [ ] `workflow/current/` 已用模板重置（`bash workflow/scripts/reset-current.sh`）

**模块 ID**：<!-- expenses / auth / … -->

## Test plan

- [ ] `pnpm type-check`（如涉及 TS）
- [ ] `pnpm test:e2e`
- [ ] VERIFY 关键路径（见 `workflow/current/VERIFY.md` 或 PR 说明）
