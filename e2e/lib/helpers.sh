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

# 每个场景脚本结束时关闭浏览器，避免 daemon 堆积
trap ab_teardown EXIT
