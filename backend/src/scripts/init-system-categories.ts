import { connect, disconnect } from 'mongoose';
import { Category, systemCategories } from '../models/category';

async function initSystemCategories() {
  try {
    // 连接数据库
    await connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/family-accounting');
    console.log('数据库连接成功');

    // 检查是否已存在系统分类
    const existingSystemCategories = await Category.find({ isSystem: true });
    
    if (existingSystemCategories.length > 0) {
      console.log('系统分类已存在，跳过初始化');
      return;
    }

    // 创建系统固定分类
    const systemCategoryDocs = systemCategories.map(cat => ({
      ...cat,
      userId: null, // 系统分类没有 userId
      roomNumber: null, // 系统分类没有 roomNumber
      isSystem: true
    }));

    const insertedCategories = await Category.insertMany(systemCategoryDocs);
    console.log(`成功创建 ${insertedCategories.length} 个系统固定分类`);

    // 显示创建的分类
    insertedCategories.forEach(cat => {
      console.log(`- ${cat.name} (${cat.type})`);
    });

  } catch (error) {
    console.error('初始化系统分类失败:', error);
  } finally {
    await disconnect();
    console.log('数据库连接已关闭');
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  initSystemCategories();
}

export { initSystemCategories }; 