#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
target="${1:-all}"
DEFAULT_SCRIPTS=(auth smoke)

run_one() {
  local script="$1"
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "▶ $(basename "$script" .sh)"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  bash "$script"
}

if [[ "$target" == "all" ]]; then
  for id in "${DEFAULT_SCRIPTS[@]}"; do
    run_one "$ROOT/scripts/${id}.sh"
  done
  echo ""
  echo "✓ agent-browser 确定性 E2E 通过"
elif [[ -f "$ROOT/scripts/${target}.sh" ]]; then
  run_one "$ROOT/scripts/${target}.sh"
else
  echo "用法: pnpm test:e2e [all|auth|smoke]" >&2
  printf '%s\n' "${DEFAULT_SCRIPTS[@]}" >&2
  exit 1
fi
