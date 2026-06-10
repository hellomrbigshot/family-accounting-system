/**
 * DEV VERIFY 桥接：window.__FAS_E2E__.invoke(handler, ...args)
 * handler 仅在 frontend/src/e2e/handlers.ts 注册，禁止在 Vue 组件中扩散。
 */
import type { Pinia } from 'pinia'
import { registerE2EHandlers } from './handlers'

const registry = new Map<string, (...args: unknown[]) => unknown>()

export function e2eRegister(name: string, fn: (...args: unknown[]) => unknown) {
  registry.set(name, fn)
}

export function e2eInvoke(name: string, ...args: unknown[]) {
  const fn = registry.get(name)
  if (!fn) {
    throw new Error(`E2E handler not found: ${name}`)
  }
  return fn(...args)
}

export function installE2E(pinia: Pinia) {
  if (!import.meta.env.DEV) return

  ;(window as unknown as { __FAS_E2E__?: { invoke: typeof e2eInvoke } }).__FAS_E2E__ = {
    invoke: e2eInvoke,
  }
  registerE2EHandlers(pinia)
}
