import { keycloak } from '@domain/middleware/keycloak-config';
import { Router, Request, Response } from 'express';

const authRouter = Router();

// Endpoint sécurisé nécessitant une authentification
authRouter.get('/protected', keycloak.protect(), (req: Request, res: Response) => {
    res.json({ message: 'You are authenticated and authorized!' });
});

// Endpoint sécurisé nécessitant une authentification
authRouter.get('/role', keycloak.protect("realm:user"), (req: Request, res: Response) => {
    res.json({ message: 'You are authenticated and authorized for admin!' });
});

// Endpoint public
authRouter.get('/public', (req: Request, res: Response) => {
    res.json({ message: 'This is a public endpoint!' });
});

export { authRouter };
