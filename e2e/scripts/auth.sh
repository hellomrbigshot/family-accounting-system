#!/usr/bin/env bash
# @see workflow/history/features/auth/SPEC.md
set -euo pipefail
# shellcheck source=../lib/helpers.sh
source "$(dirname "$0")/../lib/helpers.sh"

echo "== auth AC-2 错误密码停留登录页 =="
ab_begin_scenario "auth"
ab open "$E2E_BASE_URL/login"
ab wait 800
ab_assert_text "家庭账本"
ab find placeholder "请输入房间号" fill "$E2E_ROOM_NUMBER"
ab find placeholder "请输入密码" fill "wrong-password"
ab find role button click --name "登录"
ab wait 1500
ab_assert_url_contains "/login"

echo "== auth AC-1 登录成功 =="
ab find placeholder "请输入密码" fill "$E2E_PASSWORD"
ab find role button click --name "登录"
ab wait 1500
ab_assert_text "本月总览"
ab_assert_text "最近支出"

echo "== auth AC-4 退出登录 =="
ab_logout

echo "✓ auth 确定性场景通过"
