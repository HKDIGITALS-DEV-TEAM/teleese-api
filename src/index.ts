import { authRouter } from '@features/auth/domain/controller/auth.controller';
import { app } from './app';
import cors from 'cors';

// Configuration CORS
app.use(
    cors({
        origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true,
    })
);

// Routes
app.use('/api/v1/auth', authRouter);

// Démarrer le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
