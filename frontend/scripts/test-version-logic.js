#!/usr/bin/env node

import { execSync } from 'child_process';

// 测试版本检查逻辑
function testVersionCheck() {
  try {
    // 获取最近的提交信息
    const lastCommitMsg = execSync('git log -1 --pretty=%B', { encoding: 'utf8' }).trim();
    
    console.log('📋 最近的提交信息:');
    console.log(`"${lastCommitMsg}"`);
    console.log('');
    
    // 检查是否包含版本更新关键词
    const isVersionUpdate = lastCommitMsg.includes('chore: bump version');
    
    console.log('🔍 版本检查结果:');
    if (isVersionUpdate) {
      console.log('✅ 检测到手动版本更新，应该跳过自动版本更新');
      console.log('📝 建议: GitHub Actions 将跳过版本更新步骤');
    } else {
      console.log('📝 未检测到手动版本更新，将执行自动版本更新');
      console.log('📝 建议: GitHub Actions 将执行版本更新步骤');
    }
    
    console.log('');
    console.log('🔧 当前版本信息:');
    const packageJson = JSON.parse(execSync('cat package.json', { encoding: 'utf8' }));
    console.log(`   版本号: ${packageJson.version}`);
    
    const versionJson = JSON.parse(execSync('cat src/version.json', { encoding: 'utf8' }));
    console.log(`   构建时间: ${versionJson.buildTime}`);
    console.log(`   Git提交: ${versionJson.gitCommit}`);
    console.log(`   环境: ${versionJson.environment}`);
    
  } catch (error) {
    console.error('❌ 测试失败:', error.message);
  }
}

// 运行测试
testVersionCheck(); 