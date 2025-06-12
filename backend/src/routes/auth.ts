import { Router } from 'express';
import { login, register, getUserInfo } from '../controllers/auth';
import { auth } from '../middlewares/auth';

const router: Router = Router();

router.post('/login', login);
router.post('/register', register);
router.get('/user', auth, getUserInfo);

export default router; 