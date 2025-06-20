#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 获取版本类型参数
const versionType = process.argv[2] || 'patch'; // patch, minor, major

if (!['patch', 'minor', 'major'].includes(versionType)) {
  console.error('❌ 无效的版本类型。请使用: patch, minor, major');
  process.exit(1);
}

console.log(`🚀 准备发布 ${versionType} 版本...`);

try {
  // 检查是否有未提交的更改
  const status = execSync('git status --porcelain', { encoding: 'utf8' }).trim();
  if (status) {
    console.log('⚠️  检测到未提交的更改:');
    console.log(status);
    console.log('\n请先提交或暂存更改，然后重新运行发布脚本。');
    process.exit(1);
  }

  // 检查是否在 main 分支
  const currentBranch = execSync('git branch --show-current', { encoding: 'utf8' }).trim();
  if (currentBranch !== 'main') {
    console.log(`⚠️  当前分支是 ${currentBranch}，建议在 main 分支上发布。`);
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    const answer = await new Promise(resolve => {
      readline.question('是否继续？(y/N): ', resolve);
    });
    readline.close();
    
    if (answer.toLowerCase() !== 'y') {
      console.log('❌ 发布已取消');
      process.exit(0);
    }
  }

  // 拉取最新代码
  console.log('📥 拉取最新代码...');
  execSync('git pull origin main', { stdio: 'inherit' });

  // 运行版本更新脚本
  console.log('📝 更新版本...');
  execSync(`node scripts/version.js ${versionType}`, { stdio: 'inherit' });

  // 读取新版本号
  const packagePath = path.join(__dirname, '..', 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  const newVersion = packageJson.version;

  // 构建项目
  console.log('🔨 构建项目...');
  execSync('pnpm run build', { stdio: 'inherit' });

  // 提交版本更新
  console.log('💾 提交版本更新...');
  execSync('git add .', { stdio: 'inherit' });
  execSync(`git commit -m "chore: bump version to ${newVersion}"`, { stdio: 'inherit' });

  // 创建标签
  console.log('🏷️  创建版本标签...');
  execSync(`git tag -a "v${newVersion}" -m "Release version ${newVersion}"`, { stdio: 'inherit' });

  // 推送到远程仓库
  console.log('📤 推送到远程仓库...');
  execSync('git push origin main', { stdio: 'inherit' });
  execSync(`git push origin "v${newVersion}"`, { stdio: 'inherit' });

  console.log('\n🎉 发布成功！');
  console.log(`📋 版本信息:`);
  console.log(`   版本号: ${newVersion}`);
  console.log(`   标签: v${newVersion}`);
  console.log(`   分支: ${currentBranch}`);
  console.log(`   提交: ${execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim()}`);

  console.log('\n📝 下一步:');
  console.log('1. GitHub Actions 将自动触发构建和部署');
  console.log('2. 可以在 GitHub 上查看发布记录');
  console.log('3. 用户将收到 PWA 更新提示');

} catch (error) {
  console.error('❌ 发布失败:', error.message);
  process.exit(1);
} 