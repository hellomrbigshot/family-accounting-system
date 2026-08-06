import { Router } from 'express';
import multer from 'multer';
import { auth } from '../middlewares/auth';
import { expenseFromVoice } from '../controllers/voice';

const router: Router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

router.use(auth);
router.post('/expense-from-voice', upload.single('audio'), expenseFromVoice);

export default router;
