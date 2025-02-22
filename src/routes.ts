import { Router, Response, Request } from "express";
import authRouter from "@features/auth/domain/controller/auth.controller";
import {
  handleIncomingCall,
  handleWebSocket,
} from "@features/call/controller/call.controller";
import companyRouter from "@features/company/controller/company.controller";
import TwilioService from "@domain/config/twilio";

const router = Router();

const apiRouter = Router();

router.get('/', async (_, res : Response)=>{
  res.send('server is running')
})

// Routes API
apiRouter.use("/auth", authRouter);
apiRouter.get("/generateTwilioNumber", async (req: Request, res: Response) => {
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
apiRouter.post("/call/incoming", handleIncomingCall);
// apiRouter.ws("/call/connection", handleWebSocket);
apiRouter.use("/company", companyRouter);

router.use("/api/v1", apiRouter);

export default router;
