import { Router, Response, Request } from "express";
import authRouter from "@features/auth/domain/controller/auth.controller";
import {
  handleIncomingCall,
  handleWebSocket,
} from "@features/call/controller/call.controller";
import companyRouter from "@features/company/controller/company.controller";
import TwilioService from "@domain/config/twilio";
import express from "express";
//import TwilioService from "@core/config/twilio";
import { keycloak } from "@core/middleware/keycloak-config";
import { checkAndCreateUser } from "@core/middleware/check-and-create-user";

// Création du routeur principal
const router = express.Router();

const apiRouter = Router();


// Routes protégées par Keycloak
/*router.post(
  "/call/incoming",
  keycloak.protect("realm:user"),
  handleIncomingCall
);*/

router.get('/', async (_, res : Response)=>{
  res.send('server is running')
})

// Routes API
apiRouter.use("/auth", authRouter);

// Routes protégées pour l'authentification
router.use(
  "/companies",
  keycloak.protect("realm:user"), // Vérifie que le rôle 'user' est attribué
  checkAndCreateUser, // Middleware personnalisé pour gérer les utilisateurs
  companyRouter
);

router.get("/generateTwilioNumber", async (req: Request, res: Response) => {
  const { code } = req.query;
  const number = await TwilioService.getInstance().generatePhoneNumber(
    code as string
  );
  if (number) {
    res.status(200).send({
      generatedNumber: number,
    });
  } else {
    res.send("Aucun numéro trouvé pour le code : " + code);
  }
});
apiRouter.patch("/setVoiceURL", async (_, res: Response) => {
  try {
    const updatedConfig = await TwilioService.getInstance().updateNumbersCallback();
    res.status(200).send({error : false, message : "numbers updated successfully !"});
  } catch (error) {
    console.log(error);
    throw error;
  }
});

export { router };
