import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { User } from '../models/user';

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    roomNumber: string;
  };
}

export const auth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      throw new Error();
    }

    const decoded = verifyToken(token);
    const user = await User.findOne({
      _id: decoded.userId,
      roomNumber: decoded.roomNumber
    });

    if (!user) {
      throw new Error();
    }

    req.user = {
      userId: decoded.userId.toString(),
      roomNumber: decoded.roomNumber
    };
    next();
  } catch (error) {
    res.status(401).json({ message: '请先登录' });
  }
}; 