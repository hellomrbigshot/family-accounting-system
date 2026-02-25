# 修复 bmad-method ES Module 兼容性问题

## 问题描述
`bmad-method` 使用 `require()` 导入 ES Module 的 `inquirer`，导致 `ERR_REQUIRE_ESM` 错误。

## 解决方案

### 方案 1: 使用 patch-package（推荐，最彻底）

1. 安装 patch-package：
```bash
pnpm add -D patch-package
```

2. 手动修复 bmad-method 的代码：
   - 找到文件：`~/.npm/_npx/*/node_modules/bmad-method/tools/cli/installers/lib/core/installer.js`
   - 将 `require('inquirer')` 改为使用动态 import：
   ```javascript
   // 原来的代码
   const inquirer = require('inquirer')
   
   // 改为
   const inquirer = await import('inquirer')
   // 注意：需要将函数改为 async
   ```

3. 创建 patch：
```bash
npx patch-package bmad-method
```

4. 在 package.json 中添加 postinstall 脚本：
```json
{
  "scripts": {
    "postinstall": "patch-package"
  }
}
```

### 方案 2: 使用环境变量（临时方案）

在运行命令前设置：
```bash
NODE_OPTIONS="--no-warnings" npx bmad-method flatten
```

### 方案 3: 使用包装脚本

使用项目中的 `scripts/run-bmad.sh`：
```bash
./scripts/run-bmad.sh flatten
```

### 方案 4: 联系 bmad-method 维护者

这是 `bmad-method` 的 bug，应该由维护者修复。可以：
- 提交 issue 到 bmad-method 的 GitHub 仓库
- 或者等待更新版本

## 快速测试

运行以下命令测试修复：
```bash
./scripts/run-bmad.sh flatten
```
