import { Router } from 'express';
import mongoose from 'mongoose';

const router: Router = Router();

router.get('/', async (req, res) => {
  try {
    // 检查数据库连接
    if (mongoose.connection.readyState !== 1) {
      throw new Error('Database not connected');
    }
    
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: {
        status: 'connected',
        host: mongoose.connection.host,
        name: mongoose.connection.name
      }
    });
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(500).json({
      status: 'error',
      message: 'Service unhealthy',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router; 