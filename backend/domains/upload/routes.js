import { Router } from 'express';
import { uploadImagem } from './controller.js';

const router = Router();

router.post('/', uploadImagem);

export default router;