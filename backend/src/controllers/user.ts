import { Request, Response } from 'express';
import { User } from '../models/user';
import { generateToken } from '../utils/jwt';

export const register = async (req: Request, res: Response) => {
  try {
    const { roomNumber, password } = req.body;

    // 检查房号是否已存在
    const existingUser = await User.findOne({ roomNumber });
    if (existingUser) {
      return res.status(400).json({ message: '该房号已注册' });
    }

    // 创建新用户
    const user = new User({
      roomNumber,
      password
    });

    await user.save();

    // 生成 token
    const token = generateToken({
      userId: user._id,
      roomNumber: user.roomNumber
    });

    res.status(201).json({
      message: '注册成功',
      token
    });
  } catch (error) {
    res.status(500).json({ message: '注册失败' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { roomNumber, password } = req.body;

    // 查找用户
    const user = await User.findOne({ roomNumber });
    if (!user) {
      return res.status(401).json({ message: '房号或密码错误' });
    }

    // 验证密码
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: '房号或密码错误' });
    }

    // 生成 token
    const token = generateToken({
      userId: user._id,
      roomNumber: user.roomNumber
    });

    res.json({
      message: '登录成功',
      token
    });
  } catch (error) {
    res.status(500).json({ message: '登录失败' });
  }
}; 