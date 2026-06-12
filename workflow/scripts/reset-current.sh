#!/usr/bin/env bash
# 将 workflow/current/ 重置为空白模板（不修改 history）
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
TEMPLATES="$ROOT/workflow/templates"
CURRENT="$ROOT/workflow/current"

for name in SPEC VERIFY TEST GREEN; do
  cp "$TEMPLATES/${name}.md" "$CURRENT/${name}.md"
done

echo "✓ workflow/current/ 已重置为模板"
