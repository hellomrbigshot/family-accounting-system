import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import Room from '../models/room';

export interface AuthenticatedRequest extends Request {
  user?: {
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
    const room = await Room.findOne({ roomNumber: decoded.roomNumber });

    if (!room) {
      throw new Error();
    }

    req.user = {
      roomNumber: decoded.roomNumber
    };
    next();
  } catch (error) {
    res.status(401).json({ message: '请先登录' });
  }
}; 