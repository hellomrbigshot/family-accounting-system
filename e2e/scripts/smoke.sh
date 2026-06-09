#!/usr/bin/env bash
# 核心入口 smoke：作为 TEST 阶段的轻量守门，不覆盖复杂表单细节。
set -euo pipefail
# shellcheck source=../lib/helpers.sh
source "$(dirname "$0")/../lib/helpers.sh"

echo "== smoke 登录并验证首页 =="
ab_begin_scenario "smoke"
ab_login
ab_assert_text "本月总览"
ab_assert_text "最近支出"

echo "== smoke 支出页 =="
ab open "$E2E_BASE_URL/expenses"
ab wait 1200
ab_assert_url_contains "/expenses"
ab_assert_text "支出记录"

echo "== smoke 日历页 =="
ab open "$E2E_BASE_URL/calendar"
ab wait 1200
ab_assert_url_contains "/calendar"
ab_assert_text "支出日历"

echo "== smoke 分类 / 标签页 =="
ab open "$E2E_BASE_URL/categories"
ab wait 1200
ab_assert_url_contains "/categories"
ab_assert_text "分类管理"
ab_assert_text "标签管理"

echo "== smoke 报表页 =="
ab open "$E2E_BASE_URL/reports"
ab wait 1500
ab_assert_url_contains "/reports"
ab_assert_text "支出分析"

echo "== smoke 更多页 =="
ab open "$E2E_BASE_URL/more"
ab wait 1000
ab_assert_url_contains "/more"
ab_assert_text "更多"
ab_assert_text "退出登录"

echo "== smoke 预算弹窗可打开 =="
ab open "$E2E_BASE_URL/"
ab wait 1000
ab eval '(() => { const btn = [...document.querySelectorAll("button, [role=button]")].find(el => el.textContent.includes("设置预算")); if (!btn) throw new Error("missing 设置预算"); btn.click(); return "PASS:budget button clicked"; })()'
ab wait 700
ab_assert_text "预算金额"
ab press Escape || true

echo "✓ smoke 确定性场景通过"
