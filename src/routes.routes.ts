import { Router } from 'express';
import authRouter from '@features/auth/domain/controller/auth.controller';
import { incomingCallController, webSocketHandler } from '@features/call/domain/controller/call.controller';

const router = Router();

// Routes
router.use('/api/v1/auth', authRouter);

router.use('/api/v1/call/incoming', incomingCallController)
router.use('/api/v1/call/connection', webSocketHandler)

export default router;