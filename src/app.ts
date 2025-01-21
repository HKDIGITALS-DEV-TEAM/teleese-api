import express, { Application } from "express";
import session from "express-session";
import cors from "cors";
import { keycloak, memoryStore } from "@domain/middleware/keycloak-config";
import router from "./routes.routes";
import connectToDB from "@domain/config/db-connection";
import ExpressWs from 'express-ws';
import connectToTwilioConsole from "@domain/config/twilio-console-connection";



const app: Application = ExpressWs(express()).app;



app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS?.split(",") || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(
  session({
    secret: process.env.SESSION_SECRET || "defaultSecret",
    resave: false,
    saveUninitialized: true,
    store: memoryStore,
  })
);

app.use(keycloak.middleware());

app.use(express.json());

app.use(router);

connectToTwilioConsole()
 
connectToDB()

export { app };
