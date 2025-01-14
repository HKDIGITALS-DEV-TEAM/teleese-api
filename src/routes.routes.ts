import { Router } from 'express';
import authRouter from '@features/auth/domain/controller/auth.controller';
import { incomingCallController, webSocketHandler } from '@features/call/domain/controller/call.controller';
import companyRouter from '@features/company/controller/company.controller';

const router = Router();

const apiRouter = Router();

// Routes API
apiRouter.use('/auth', authRouter);
apiRouter.use('/call/incoming', incomingCallController);
apiRouter.use('/call/connection', webSocketHandler);
apiRouter.use('/company', companyRouter);

router.use('/api/v1', apiRouter);

export default router;