import { Router } from 'express';
import { processData } from '../controllers/processController';

const router = Router();

router.post('/', processData);

export default router;
