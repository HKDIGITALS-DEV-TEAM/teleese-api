import { Router } from 'express';
import authRouter from '@features/auth/domain/controller/auth.controller';

const router = Router();

// Routes
router.use('/api/v1/auth', authRouter);

export default router;