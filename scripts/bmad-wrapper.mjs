#!/usr/bin/env node

// 包装脚本：解决 bmad-method 的 ES Module 兼容性问题
// 使用方法: node scripts/bmad-wrapper.mjs [command]

import { spawn } from 'child_process'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// 设置环境变量以支持混合模块
process.env.NODE_OPTIONS = '--no-warnings'

const args = process.argv.slice(2)
const command = args[0] || 'flatten'

// 使用 npx 运行 bmad-method，但通过 node 直接执行
const npxPath = join(process.env.HOME || '', '.npm/_npx')
const bmadPath = join(npxPath, '2e2f2306f34e978a/node_modules/bmad-method')

console.log(`正在运行: bmad-method ${command}`)
console.log(`路径: ${bmadPath}`)

// 尝试直接运行 bmad-method
const child = spawn('npx', ['--yes', 'bmad-method', ...args], {
  stdio: 'inherit',
  shell: true,
  env: {
    ...process.env,
    NODE_OPTIONS: '--no-warnings --experimental-specifier-resolution=node'
  }
})

child.on('error', (error) => {
  console.error('执行错误:', error)
  process.exit(1)
})

child.on('exit', (code) => {
  process.exit(code || 0)
})
