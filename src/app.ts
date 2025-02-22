import express, { Application } from "express";
import session from "express-session";
import cors from "cors";
import { keycloak, memoryStore } from "@domain/middleware/keycloak-config";
import router from "./routes";
import connectToDB from "@domain/config/db-connection";
import ExpressWs from "express-ws";
import TwilioService from "@domain/config/twilio";
import { handleWebSocket } from "@features/call/controller/call.controller";

const { app } = ExpressWs(express());

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

app.use(express.urlencoded({ extended: true }));

app.use(router);

TwilioService.getInstance().validateConnection();

connectToDB();

app.ws("/api/v1/call/connection", handleWebSocket);

export { app };
