import { Router } from 'express';
import { register, login } from '../controllers/user';
import { auth } from '../middlewares/auth';
import { getUserInfo } from '../controllers/auth';

const router: Router = Router();

router.post('/register', register);
router.post('/login', login);
router.use(auth);
router.get('/info', getUserInfo);

export default router;
