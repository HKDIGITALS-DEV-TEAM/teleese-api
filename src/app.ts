import { keycloak, memoryStore } from '@domain/middleware/keycloak-config';
import express, { Application } from 'express';
import session from 'express-session';

const app: Application = express();

// Middleware session
app.use(
    session({
        secret: process.env.SESSION_SECRET || 'defaultSecret',
        resave: false,
        saveUninitialized: true,
        store: memoryStore,
    })
);

// Initialiser Keycloak
app.use(keycloak.middleware());

// Middleware JSON
app.use(express.json());

export { app };
