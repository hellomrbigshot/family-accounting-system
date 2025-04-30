import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

// 房间模型定义
const RoomSchema = new mongoose.Schema({
  roomNumber: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Room = mongoose.model('Room', RoomSchema);

async function initializeDatabase() {
  try {
    // 连接数据库
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/family-accounting');
    console.log('Connected to MongoDB');

    // 检查是否已存在默认房间
    const existingRoom = await Room.findOne({ roomNumber: '888888' });
    if (!existingRoom) {
      // 创建默认房间
      const hashedPassword = await bcrypt.hash('123456', Number(process.env.PASSWORD_SALT_ROUNDS) || 10);
      await Room.create({
        roomNumber: '888888',
        password: hashedPassword
      });
      console.log('Default room created successfully');
    } else {
      console.log('Default room already exists');
    }

    console.log('Database initialization completed');
  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    await mongoose.disconnect();
  }
}

// 运行初始化
initializeDatabase(); 