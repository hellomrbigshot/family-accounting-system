#!/usr/bin/env bash
# shellcheck disable=SC1091
set -euo pipefail

E2E_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PROJECT_ROOT="$(cd "$E2E_ROOT/.." && pwd)"

if [[ -f "$E2E_ROOT/config.env" ]]; then
  # shellcheck source=/dev/null
  set -a
  source "$E2E_ROOT/config.env"
  set +a
fi

: "${E2E_BASE_URL:=http://localhost:5180}"
: "${E2E_ROOM_NUMBER:=888888}"
: "${E2E_PASSWORD:=123456}"
: "${E2E_DEVICE:=iPhone 15}"

NODE_BIN="$(command -v node || true)"
AB_JS="$PROJECT_ROOT/node_modules/agent-browser/bin/agent-browser.js"

ab() {
  if [[ -n "$NODE_BIN" && -f "$AB_JS" ]]; then
    "$NODE_BIN" "$AB_JS" "$@"
  else
    npx agent-browser "$@"
  fi
}

ab_close() {
  ab close >/dev/null 2>&1 || true
  sleep 0.5
}

ab_begin_scenario() {
  local id="${1:-run}"
  ab close --all >/dev/null 2>&1 || true
  export AGENT_BROWSER_SESSION="e2e-${id}-$$"
  sleep 1
  ab set device "$E2E_DEVICE"
}

ab_teardown() {
  ab close --all >/dev/null 2>&1 || true
}

ab_login() {
  ab open "$E2E_BASE_URL/login"
  ab wait --load networkidle
  ab find placeholder "请输入房间号" fill "$E2E_ROOM_NUMBER"
  ab find placeholder "请输入密码" fill "$E2E_PASSWORD"
  ab find role button click --name "登录"
  ab wait --text "本月总览"
}

ab_logout() {
  ab open "$E2E_BASE_URL/more"
  ab wait --load networkidle
  ab eval '(() => { const btn = [...document.querySelectorAll("button")].find(b => b.textContent.includes("退出登录")); btn?.click() })()'
  ab wait 1500
  ab eval '(() => { const dlg = document.querySelector("[role=dialog]"); const btn = dlg ? [...dlg.querySelectorAll("button")].find(b => b.textContent.trim() === "确认") : null; btn?.click() })()'
  ab wait 2000
  ab get url | grep -q '/login'
}

ab_open_mobile() {
  ab open "$1"
  ab wait --load networkidle
}

ab_assert_text() {
  local text="$1"
  ab eval "document.body.innerText.includes('$text') ? 'PASS:$text' : (() => { throw new Error('missing text: $text') })()"
}

# 支出页统计徽章：总计: ¥xxx · N 笔（Issue #40 / expenses AC-7）
ab_assert_expense_stats_badge() {
  ab eval "(() => {
    const badge = [...document.querySelectorAll('span')]
      .map(s => s.textContent?.trim())
      .find(t => t && t.includes('总计') && t.includes('笔'));
    if (!badge || !/总计:\\s*¥[\\d,]+(?:\\.\\d+)?\\s*·\\s*\\d+\\s*笔/.test(badge)) {
      throw new Error('invalid expense stats badge: ' + (badge || 'missing'));
    }
    return 'PASS:' + badge;
  })()"
}

ab_assert_url_contains() {
  local path="$1"
  ab get url | grep -q "$path"
  echo "PASS:url contains $path"
}

ab_tab() {
  ab find text "$1" click
}

ab_screenshot() {
  local name="$1"
  mkdir -p "$E2E_ROOT/artifacts"
  ab screenshot "$E2E_ROOT/artifacts/${name}.png"
}

# DEV E2E bridge（frontend/src/e2e/bridge.ts）
ab_e2e_invoke() {
  local handler="$1"
  ab eval "(async () => { const r = await window.__FAS_E2E__.invoke('${handler}'); return typeof r === 'string' ? r : (r ?? 'ok'); })()"
}

ab_e2e_invoke_arg() {
  local handler="$1"
  local arg="$2"
  ab eval "(async () => { await window.__FAS_E2E__.invoke('${handler}', ${arg}); return 'ok'; })()"
}

ab_e2e_invoke2() {
  local handler="$1"
  local arg1="$2"
  local arg2="$3"
  ab eval "(async () => { await window.__FAS_E2E__.invoke('${handler}', ${arg1}, ${arg2}); return 'ok'; })()"
}

ab_e2e_create_expense() {
  local mark="$1"
  local amount="${2:-12.34}"
  local date="${3:-$(date +%Y-%m-%d)}"
  ab eval "(async () => {
    const category = await window.__FAS_E2E__.invoke('meta.firstExpenseCategoryId');
    if (!category) throw new Error('no expense category');
    await window.__FAS_E2E__.invoke('home.createExpense', {
      category,
      amount: '${amount}',
      description: '${mark}',
      date: '${date}'
    });
    return category;
  })()"
}

ab_click_testid() {
  ab click "[data-testid=\"$1\"]"
}

ab_confirm_dialog() {
  ab eval "(() => { const dlg = document.querySelector('[role=dialog]') || document.querySelector('.van-dialog'); const btn = dlg && [...dlg.querySelectorAll('button')].find(b => b.textContent.trim() === '确认'); btn?.click(); return !!btn; })()"
  ab wait 1500
}

ab_swipe_reveal() {
  local text="$1"
  ab eval "(() => { const cell = [...document.querySelectorAll('.van-swipe-cell')].find(c => c.textContent.includes('${text}')); if (!cell) throw new Error('missing swipe cell: ${text}'); const wrap = cell.querySelector('.van-swipe-cell__wrapper'); if (wrap) wrap.style.transform = 'translate3d(-140px, 0, 0)'; return true; })()"
}

ab_swipe_action() {
  local text="$1"
  local action="$2"
  ab_swipe_reveal "$text"
  ab wait 300
  ab eval "(() => { const cell = [...document.querySelectorAll('.van-swipe-cell')].find(c => c.textContent.includes('${text}')); const btn = cell && [...cell.querySelectorAll('*')].find(e => e.textContent.trim() === '${action}'); btn?.click(); return !!btn; })()"
}

# 每个场景脚本结束时关闭浏览器，避免 daemon 堆积
trap ab_teardown EXIT
