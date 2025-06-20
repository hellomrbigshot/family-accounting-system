# 版本管理指南

## 概述

本项目使用自动化的版本管理系统，支持本地开发和 CI/CD 环境。

## 版本管理流程

### 1. 本地开发版本管理

#### 仅更新版本号（不提交）
```bash
# 补丁版本 (0.0.1 -> 0.0.2)
pnpm version:patch

# 次要版本 (0.0.1 -> 0.1.0)
pnpm version:minor

# 主要版本 (0.0.1 -> 1.0.0)
pnpm version:major
```

#### 完整发布流程（推荐）
```bash
# 补丁版本发布
pnpm release:patch

# 次要版本发布
pnpm release:minor

# 主要版本发布
pnpm release:major
```

### 2. CI/CD 自动版本管理

当代码推送到 `main` 分支时，GitHub Actions 会自动：

1. 更新版本号（补丁版本）
2. 构建项目
3. 提交版本更新
4. 创建 Git 标签
5. 部署到服务器

## 版本信息文件

### `src/version.json`
```json
{
  "version": "0.0.4",
  "buildTime": "2025-06-20T03:43:04.067Z",
  "buildNumber": "123",
  "gitCommit": "main-52aed14",
  "environment": "ci"
}
```

### 字段说明
- `version`: 语义化版本号
- `buildTime`: 构建时间（ISO 格式）
- `buildNumber`: 构建编号（CI 环境为 GitHub Actions Run Number）
- `gitCommit`: Git 提交信息（格式：分支-哈希）
- `environment`: 构建环境（ci/local）

## 版本策略

### 语义化版本 (SemVer)
- **主要版本 (Major)**: 不兼容的 API 修改
- **次要版本 (Minor)**: 向下兼容的功能性新增
- **补丁版本 (Patch)**: 向下兼容的问题修正

### 分支策略
- `main`: 主分支，用于生产发布
- 功能开发在其他分支进行
- 只有 `main` 分支的推送会触发自动构建

## PWA 更新机制

### 自动更新
- Service Worker 会自动检测新版本
- 用户会收到更新提示
- 支持离线更新

### 版本检查
- 前端会检查 `/src/version.json` 获取版本信息
- 与本地缓存版本比较
- 显示版本差异给用户

## 最佳实践

### 1. 开发流程
1. 在功能分支开发新功能
2. 完成开发后合并到 `main` 分支
3. 使用 `pnpm release:patch` 发布（或让 CI 自动处理）

### 2. 版本命名
- 使用有意义的提交信息
- 遵循语义化版本规范
- 在发布说明中描述变更

### 3. 测试
- 发布前确保所有测试通过
- 在本地测试构建流程
- 验证 PWA 更新机制

## 故障排除

### 常见问题

#### 1. 版本冲突
```bash
# 如果出现版本冲突，手动解决后重新发布
git pull origin main
pnpm release:patch
```

#### 2. 构建失败
```bash
# 检查依赖和配置
pnpm install
pnpm run type-check
pnpm run build
```

#### 3. PWA 更新不生效
- 清除浏览器缓存
- 检查 Service Worker 状态
- 验证版本文件路径

### 调试命令
```bash
# 查看当前版本
node -p "require('./package.json').version"

# 查看版本信息
cat src/version.json

# 查看 Git 标签
git tag -l

# 查看构建历史
git log --oneline --grep="chore: bump version"
```

## 注意事项

1. **权限要求**: GitHub Actions 需要 `GITHUB_TOKEN` 权限来推送代码
2. **分支保护**: 建议在 GitHub 中设置分支保护规则
3. **回滚**: 如需回滚，删除标签并重置版本号
4. **备份**: 重要发布前建议创建备份分支 