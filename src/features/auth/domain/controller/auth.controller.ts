import { Router, Request, Response } from "express";
import axios from "axios";
import { User } from "@features/auth/entity/userSchema";
const authRouter = Router();

const KEYCLOAK_URL = process.env.KEYCLOAK_URL as string;
const REALM = process.env.KEYCLOAK_REALM as string;
const CLIENT_ID = process.env.KEYCLOAK_CLIENT_ID as string;
const CLIENT_SECRET = process.env.KEYCLOAK_CLIENT_SECRET as string;
const REDIRECT_URI = "http://localhost:3000/api/v1/auth/callback";

interface KCUser {
  email: string,
  name : string,
  preferred_username : string,
  sub : string,
  email_verified : boolean,
  given_name : string,
  family_name : string
}

authRouter.get("/register", (req: Request, res: Response) => {
  const registerUrl = `${KEYCLOAK_URL}/realms/${REALM}/protocol/openid-connect/registrations?client_id=${CLIENT_ID}&response_type=code&scope=openid&redirect_uri=${REDIRECT_URI}`;
  res.redirect(registerUrl);
});

authRouter.get(
  "/callback",
  async (req: Request, res: Response): Promise<void> => {
    const code = req.query.code as string;

    if (!code) {
      res.status(400).json({ error: "Code d'autorisation manquant" });
      return;
    }

    try {
      const tokenResponse = await axios.post(
        `${KEYCLOAK_URL}/realms/${REALM}/protocol/openid-connect/token`,
        new URLSearchParams({
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          code: code,
          grant_type: "authorization_code",
          redirect_uri: REDIRECT_URI,
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      const accessToken = tokenResponse.data.access_token;

      const userInfoResponse = await axios.get(
        `${KEYCLOAK_URL}/realms/${REALM}/protocol/openid-connect/userinfo`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const user : KCUser = userInfoResponse.data;

      console.log("Utilisateur connecté :", user);

      await saveUserToDatabase(user);

      res.json({ status: "utilisateur connecté", user : user });
    } catch (error: any) {
      console.error(
        "Erreur d'authentification :",
        error.response ? error.response.data : error.message
      );
      res.status(500).json({ error: "Erreur lors de l'authentification" });
    }
  }
);

async function saveUserToDatabase(user: KCUser) {
  try {
    const newUser = await User.create({
      first_name: user.given_name,
      last_name: user.family_name,
      email: user.email,
    });
    if (newUser) {
      console.log(`l'utilisateur ${newUser.first_name} ${newUser.last_name} a été ajouté en bd`);
    }
  } catch (error) {}

  console.log("Sauvegarde de l'utilisateur dans la BD :", user);
}

export default authRouter;
