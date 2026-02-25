#!/bin/bash

# 解决 bmad-method ES Module 兼容性问题的脚本
# 使用方法: ./scripts/run-bmad.sh [command]

# 方案1: 尝试使用 NODE_OPTIONS 环境变量
export NODE_OPTIONS="--no-warnings --experimental-specifier-resolution=node"

# 方案2: 如果方案1不行，尝试使用 --loader
# export NODE_OPTIONS="--loader ./node_modules/.bin/loader.mjs"

# 运行命令
npx --yes bmad-method "$@"
