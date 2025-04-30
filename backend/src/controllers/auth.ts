import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Room from '../models/room';

export const login = async (req: Request, res: Response) => {
  try {
    const { roomNumber, password } = req.body;

    // 查找房间
    const room = await Room.findOne({ roomNumber });
    if (!room) {
      return res.status(401).json({ message: '房间号或密码错误' });
    }

    // 验证密码
    const isPasswordValid = await bcrypt.compare(password, room.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: '房间号或密码错误' });
    }

    // 生成 JWT token
    const token = jwt.sign(
      { roomNumber: room.roomNumber },
      process.env.JWT_SECRET || 'your_jwt_secret_key',
      { expiresIn: process.env.JWT_EXPIRES_IN || '15d' }
    );

    res.json({ token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { roomNumber, password } = req.body;

    // 检查房间号是否已存在
    const existingRoom = await Room.findOne({ roomNumber });
    if (existingRoom) {
      return res.status(400).json({ message: '房间号已存在' });
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
      { expiresIn: process.env.JWT_EXPIRES_IN || '15d' }
    );

    res.status(201).json({ token });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
}; 