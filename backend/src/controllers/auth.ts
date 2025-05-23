import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Room from '../models/room';
import CryptoJS from 'crypto-js';
import { JwtPayload } from '../utils/jwt';

// 加密密钥（应该与前端保持一致，实际项目中应该从环境变量获取）
const ENCRYPTION_KEY = 'your-secure-encryption-key-32-chars-long!!';

// 验证时间戳是否在有效期内（5分钟）
const isValidTimestamp = (timestamp: number): boolean => {
  const now = Date.now();
  const fiveMinutes = 5 * 60 * 1000;
  return Math.abs(now - timestamp) <= fiveMinutes;
};

// 高级密码解密函数
const decryptPassword = (encrypted: string, timestamp: number, nonce: string): string => {
  try {
    // 验证时间戳
    if (!isValidTimestamp(timestamp)) {
      throw new Error('请求已过期');
    }

    // 使用 AES 解密
    const decrypted = CryptoJS.AES.decrypt(
      encrypted,
      ENCRYPTION_KEY,
      {
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
        iv: CryptoJS.enc.Utf8.parse(nonce)
      }
    ).toString(CryptoJS.enc.Utf8);

    // 解析解密后的数据
    const data = JSON.parse(decrypted);
    
    // 验证时间戳和随机数
    if (data.timestamp !== timestamp || data.nonce !== nonce) {
      throw new Error('数据被篡改');
    }

    return data.password;
  } catch (error) {
    console.error('Password decryption error:', error);
    throw new Error('密码解密失败');
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { roomNumber, password: encrypted, timestamp, nonce } = req.body;

    // 验证必要参数
    if (!encrypted || !timestamp || !nonce) {
      res.status(400).json({ message: '缺少必要的参数' });
      return;
    }

    // 解密密码
    const password = decryptPassword(encrypted, timestamp, nonce);

    // 查找房间
    const room = await Room.findOne({ roomNumber });
    if (!room) {
      res.status(401).json({ message: '房间号或密码错误' });
      return;
    }

    // 验证密码
    const isPasswordValid = await bcrypt.compare(password, room.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: '房间号或密码错误' });
      return;
    }

    // 生成 JWT token
    const token = jwt.sign(
      { roomNumber: room.roomNumber },
      process.env.JWT_SECRET || 'your_jwt_secret_key',
      { expiresIn: '15d' }
    );

    res.json({ token });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({ message: error.message || '服务器内部错误' });
  }
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { roomNumber, password: encrypted, timestamp, nonce } = req.body;

    // 验证必要参数
    if (!encrypted || !timestamp || !nonce) {
      res.status(400).json({ message: '缺少必要的参数' });
      return;
    }

    // 解密密码
    const password = decryptPassword(encrypted, timestamp, nonce);

    // 检查房间号是否已存在
    const existingRoom = await Room.findOne({ roomNumber });
    if (existingRoom) {
      res.status(400).json({ message: '房间号已存在' });
      return;
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(
      password,
      Number(process.env.PASSWORD_SALT_ROUNDS) || 10
    );

    // 创建新房间
    const room = new Room({
      roomNumber,
      password: hashedPassword,
    });
    await room.save();

    // 生成 JWT token
    const token = jwt.sign(
      { roomNumber: room.roomNumber },
      process.env.JWT_SECRET || 'your_jwt_secret_key',
      { expiresIn: '15d' }
    );

    res.status(201).json({ token });
  } catch (error: any) {
    console.error('Register error:', error);
    res.status(500).json({ message: error.message || '服务器内部错误' });
  }
};

export const getUserInfo = async (req: Request, res: Response): Promise<void> => {
  try {
    // 从 JWT 中获取房间号
    const room = (req as any).user;
    if (!room) {
      res.status(401).json({ message: '未授权' });
      return;
    }

    // 返回用户信息（不包含敏感信息）
    res.json({
      roomNumber: room.roomNumber,
      createdAt: room.createdAt,
      updatedAt: room.updatedAt
    });
  } catch (error) {
    console.error('Get user info error:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
}; 