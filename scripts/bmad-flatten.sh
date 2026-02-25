#!/bin/bash

# 解决 bmad-method ES Module 兼容性问题
# 直接运行: ./scripts/bmad-flatten.sh

# 设置 Node.js 选项以尝试绕过 ES Module 检查
# 注意：这只是一个临时方案，根本问题需要 bmad-method 修复

echo "正在运行 bmad-method flatten..."
echo "注意：如果仍然出现 ERR_REQUIRE_ESM 错误，这是 bmad-method 的已知问题"
echo ""

# 尝试方案1: 使用 NODE_OPTIONS
export NODE_OPTIONS="--no-warnings"

# 运行命令
npx --yes bmad-method flatten

# 如果失败，输出提示信息
if [ $? -ne 0 ]; then
    echo ""
    echo "❌ 命令执行失败"
    echo ""
    echo "可能的解决方案："
    echo "1. 等待 bmad-method 更新以支持 ES Module"
    echo "2. 手动创建 flattened-codebase.xml 文件"
    echo "3. 联系 bmad-method 维护者报告此问题"
    echo ""
    echo "临时替代方案："
    echo "可以手动创建 flattened-codebase.xml，包含项目的主要代码文件"
fi
