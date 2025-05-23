import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import Room from '../models/room';
import { JwtPayload } from '../utils/jwt';

// 扩展 Request 类型以包含 user 属性
declare global {
  namespace Express {
    interface Request {
      user?: {
        _id: string;
        roomNumber: string;
      };
    }
  }
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: '未提供认证令牌' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as JwtPayload;
    const room = await Room.findOne({ roomNumber: decoded.roomNumber });

    if (!room) {
      return res.status(401).json({ message: '房间不存在' });
    }

    req.user = {
      _id: room._id.toString(),
      roomNumber: room.roomNumber
    };
    next();
  } catch (error) {
    console.error('认证失败:', error);
    res.status(401).json({ message: '认证失败' });
  }
}; 