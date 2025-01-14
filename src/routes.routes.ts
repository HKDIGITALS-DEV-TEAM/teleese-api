import { Router } from 'express';
import authRouter from '@features/auth/domain/controller/auth.controller';
import companyRouter from '@features/feature-company/controller/company.controller';

const router = Router();

// Routes
router.use('/api/v1/auth', authRouter);
router.use("/api/v1/company", companyRouter);

export default router;