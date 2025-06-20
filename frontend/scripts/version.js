#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 获取版本类型参数
const versionType = process.argv[2] || 'patch'; // patch, minor, major

// 检查是否在 CI 环境中
const isCI = process.env.CI === 'true' || process.env.GITHUB_ACTIONS === 'true';

// 获取 Git 提交哈希
function getGitCommit() {
  try {
    // 检查是否在 Git 仓库中
    execSync('git rev-parse --git-dir', { stdio: 'ignore' });
    
    // 获取当前提交的短哈希
    const commitHash = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim();
    
    // 获取当前分支名
    const branch = execSync('git branch --show-current', { encoding: 'utf8' }).trim();
    
    return `${branch}-${commitHash}`;
  } catch (error) {
    // 如果不在 Git 仓库中或获取失败，返回 unknown
    return 'unknown';
  }
}

// 读取 package.json
const packagePath = path.join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

// 解析当前版本
const [major, minor, patch] = packageJson.version.split('.').map(Number);

// 根据类型更新版本
let newVersion;
switch (versionType) {
  case 'major':
    newVersion = `${major + 1}.0.0`;
    break;
  case 'minor':
    newVersion = `${major}.${minor + 1}.0`;
    break;
  case 'patch':
  default:
    newVersion = `${major}.${minor}.${patch + 1}`;
    break;
}

// 更新 package.json
packageJson.version = newVersion;
fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2) + '\n');

// 生成版本信息文件
const versionInfo = {
  version: newVersion,
  buildTime: new Date().toISOString(),
  buildNumber: process.env.BUILD_NUMBER || process.env.GITHUB_RUN_NUMBER || 'local',
  gitCommit: process.env.GIT_COMMIT || getGitCommit(),
  environment: isCI ? 'ci' : 'local'
};

const versionPath = path.join(__dirname, '..', 'src', 'version.json');
fs.writeFileSync(versionPath, JSON.stringify(versionInfo, null, 2) + '\n');

// 更新 Service Worker 缓存名称
const swPath = path.join(__dirname, '..', 'public', 'sw.js');
if (fs.existsSync(swPath)) {
  let swContent = fs.readFileSync(swPath, 'utf8');
  swContent = swContent.replace(
    /const CACHE_NAME = ['"`][^'"`]*['"`];/,
    `const CACHE_NAME = 'family-accounting-v${newVersion.replace(/\./g, '-')}';`
  );
  fs.writeFileSync(swPath, swContent);
}

console.log(`✅ 版本已更新到: ${newVersion}`);
console.log(`📝 版本信息已写入: src/version.json`);
console.log(`🔧 Service Worker 缓存名称已更新`);
console.log(`🌍 环境: ${isCI ? 'CI/CD' : '本地开发'}`);

// 输出版本信息
console.log('\n📋 版本信息:');
console.log(`   版本号: ${versionInfo.version}`);
console.log(`   构建时间: ${versionInfo.buildTime}`);
console.log(`   构建编号: ${versionInfo.buildNumber}`);
console.log(`   Git提交: ${versionInfo.gitCommit}`);
console.log(`   环境: ${versionInfo.environment}`);

// 如果在 CI 环境中，输出一些额外的信息
if (isCI) {
  console.log('\n🚀 CI/CD 信息:');
  console.log(`   GitHub Actions Run ID: ${process.env.GITHUB_RUN_ID || 'N/A'}`);
  console.log(`   GitHub Actions Run Number: ${process.env.GITHUB_RUN_NUMBER || 'N/A'}`);
  console.log(`   工作流: ${process.env.GITHUB_WORKFLOW || 'N/A'}`);
} 