import express from "express";
//import TwilioService from "@core/config/twilio";
import { keycloak } from "@core/middleware/keycloak-config";
import { checkAndCreateUser } from "@core/middleware/check-and-create-user";
import companyRouter from "@features/company/domain/controller/company-controller";

// Création du routeur principal
const router = express.Router();

// Routes protégées par Keycloak
/*router.post(
  "/call/incoming",
  keycloak.protect("realm:user"),
  handleIncomingCall
);*/

// Routes protégées pour l'authentification
router.use(
  "/companies",
  keycloak.protect("realm:user"), // Vérifie que le rôle 'user' est attribué
  checkAndCreateUser, // Middleware personnalisé pour gérer les utilisateurs
  companyRouter
);

/*router.get("/generateTwilioNumber", async (req: Request, res: Response) => {
  const { code } = req.query;
  const number = await TwilioService.getInstance().generatePhoneNumber(
    code as string
  );
  if (number) {
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
});*/
//apiRouter.ws("/call/connection", handleWebSocket);

export { router };
