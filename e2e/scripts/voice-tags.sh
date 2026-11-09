#!/usr/bin/env bash
# 确定性语音标签回填：模拟麦克风和付费语音 API，经真实 UI 操作，不保存账单。
set -euo pipefail
source "$(dirname "$0")/../lib/helpers.sh"

export AGENT_BROWSER_INIT_SCRIPTS="$E2E_ROOT/fixtures/voice-recorder.js"
export AGENT_BROWSER_DEFAULT_TIMEOUT=15000
ab_begin_scenario "voice-tags"
voice_teardown() {
  local code=$?
  if [[ "$code" != 0 ]]; then
    ab snapshot -i || true
    ab_screenshot 'voice-tags-failure' || true
    ab console || true
  fi
  ab_teardown
}
trap voice_teardown EXIT
finish_recording() {
  ab eval '(() => {
    const button = [...document.querySelectorAll("button")].find(el => el.textContent.trim() === "结束并识别")
    if (!button || button.disabled) throw new Error("finish recording button unavailable")
    button.click()
    return "PASS:finish recording clicked"
  })()'
}
ab network route '**/api/tags' --body '[{"id":"000000000000000000000001","name":"E2E咖啡","type":"normal","archived":false,"color":"#6366f1"},{"id":"000000000000000000000002","name":"E2E通勤","type":"normal","archived":false,"color":"#10b981"}]'
ab network route '**/api/voice/expense-from-voice' --body '{"rawText":"今天买了一杯拿铁十八元","amount":18,"categoryName":"餐饮","categoryId":"000000000000000000000003","description":"拿铁","date":"2026-05-02","isExtra":false,"tags":["000000000000000000000001"],"tagNames":["E2E咖啡"]}'
ab_login

echo "== 首次语音自动选中标签 =="
ab click '.home-floating-action--voice'
ab wait --text '正在录音'
finish_recording
ab wait '[data-testid="voice-rerecord"]'
ab eval '(() => {
  const tags = document.querySelector("[data-testid=expense-tags]").textContent
  if (!tags.includes("E2E咖啡") || tags.includes("E2E通勤")) throw new Error("incorrect initial voice tags: " + tags)
  return "PASS:initial voice tag selected"
})()'

echo "== 重录替换标签 =="
# 等待首次录音遮罩退出动画结束，避免点击被遮罩接收。
ab wait 500
ab network unroute '**/api/voice/expense-from-voice'
ab network route '**/api/voice/expense-from-voice' --body '{"rawText":"今天坐地铁五元","amount":5,"categoryName":"交通","categoryId":"000000000000000000000003","description":"地铁","date":"2026-05-02","isExtra":false,"tags":["000000000000000000000002"],"tagNames":["E2E通勤"]}'
ab eval '(() => {
  const button = document.querySelector("[data-testid=voice-rerecord]")
  if (!button || button.disabled) throw new Error("rerecord button unavailable")
  button.click()
  return "PASS:rerecord button clicked"
})()'
ab wait --text '正在录音'
finish_recording
ab wait --text '今天坐地铁五元'
ab eval '(() => {
  const tags = document.querySelector("[data-testid=expense-tags]").textContent
  if (!tags.includes("E2E通勤") || tags.includes("E2E咖啡")) throw new Error("incorrect rerecorded tags: " + tags)
  return "PASS:rerecord replaces voice tags"
})()'

echo "== 标签允许手动取消 =="
ab wait 500
ab eval 'document.querySelector("[data-testid=expense-tags]").click()'
ab wait --text '选择标签'
ab eval '(() => {
  const cell = [...document.querySelectorAll(".tag-cell")].find(el => el.textContent.includes("E2E通勤"))
  if (!cell) throw new Error("missing tag picker option")
  cell.click()
  return "PASS:tag picker option toggled"
})()'
ab eval '(() => {
  const button = [...document.querySelectorAll(".van-popup button")].find(el => el.textContent.trim() === "确定")
  if (!button) throw new Error("missing tag picker confirmation")
  button.click()
  return "PASS:tag picker confirmed"
})()'
ab wait 300
ab eval '(() => {
  const tags = document.querySelector("[data-testid=expense-tags]").textContent
  if (!tags.includes("请选择标签") || tags.includes("E2E通勤")) throw new Error("cannot deselect voice tag: " + tags)
  return "PASS:voice tag can be manually deselected"
})()'
ab_screenshot 'voice-tags'
ab errors
echo "✓ voice-tags 确定性场景通过"
