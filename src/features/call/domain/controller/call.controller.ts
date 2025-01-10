import { Router, Request, Response } from "express";
import VoiceResponse from "twilio/lib/twiml/VoiceResponse";
import { ElevenLabsClient } from "elevenlabs";
import { WebSocket } from "ws";
import { Readable } from "stream";
import OpenAI from "openai";
import {
  ChatCompletionMessageParam,
  ChatCompletionTool,
} from "openai/resources/chat/completions";
import { FunctionDefinition } from "openai/resources";

const openai = new OpenAI();
const callRouter = Router();

const elevenlabs = new ElevenLabsClient();
const voiceId = "21m00Tcm4TlvDq8ikWAM";
const outputFormat = "ulaw_8000";

const isDateTimeAvailableTool: FunctionDefinition = {
  name: "is_date_time_available",
  description:
    "Vérifie si une date et une heure spécifiques sont disponibles pour l'arrivée d'un client. Utilisez cet outil lorsqu'un client demande si une date précise est libre, comme 'Est-ce que je peux venir le 12 janvier à 19h ?'",
  parameters: {
    type: "object",
    properties: {
      dateTime: {
        type: "string",
        format: "date-time",
        description:
          "La date et l'heure souhaitées par le client au format ISO 8601 (ex. 2025-01-12T19:00:00Z).",
      },
    },
    required: ["dateTime"],
    additionalProperties: false,
  },
};

const getAvailablesDatesAndTimes: FunctionDefinition = {
  name: "get_available_dates_and_times",
  description:
    "Récupère les dates et heures disponibles pour l'arrivée d'un client. Utilisez cette fonction lorsque vous devez obtenir toutes les plages horaires disponibles sur une période donnée, par exemple lorsqu'un client demande 'Quand pouvons-nous venir cette semaine ?'.",
  parameters: {
    type: "object",
    properties: {
      startDateTime: {
        type: "string",
        format: "date-time",
        description:
          "La date et l'heure de début de la plage horaire à vérifier, au format ISO 8601 (ex. 2025-01-10T10:00:00Z).",
      },
      endDateTime: {
        type: "string",
        format: "date-time",
        description:
          "La date et l'heure de fin de la plage horaire à vérifier, au format ISO 8601 (ex. 2025-01-15T18:00:00Z).",
      },
    },
    required: ["startDateTime", "endDateTime"],
    additionalProperties: false,
  },
};

const restaurantTools: ChatCompletionTool[] = [
  {
    function: getAvailablesDatesAndTimes,
    type: "function",
  },
  {
    function: isDateTimeAvailableTool,
    type: "function",
  },
];

function getRestaurantContext(restaurantCallNumber: number): string {
  const specificDatas: string = "";

  /**
   * charger les données du restaurant depuis la base de données
   */

  async function getDatasFromDB() {
    // faire des requêtes à la BD
  }

  const restaurantContext = `
Vous êtes un assistant virtuel pour un restaurant nommé "La Belle Cuisine". 
Voici les informations importantes à prendre en compte pour répondre aux clients :

- Nom du Restaurant : La Belle Cuisine
- Adresse : 123 Rue des Gourmets, 75000 Paris, France
- Numéro de Téléphone : +33 1 23 45 67 89
- Type de Cuisine : Française contemporaine
- Horaires d'ouverture : 
  - Lundi à Vendredi : 12h00 - 14h30 et 19h00 - 22h30
  - Samedi : 19h00 - 23h00
  - Fermé le Dimanche
- Capacité : 50 couverts
- Réservations : 
  - Obligatoire pour les groupes de plus de 6 personnes.
  - Réservations en ligne via le site web ou par téléphone.
- Site Web : www.labellecuisine.fr
- Politique d'annulation : Annulation gratuite jusqu'à 24 heures avant la réservation.
- Menu :
  - Entrées : Salade de chèvre chaud, Tartare de saumon.
  - Plats principaux : Filet de bœuf, Risotto aux champignons.
  - Desserts : Tarte Tatin, Mousse au chocolat.
  - Menus spéciaux : Menu végétarien disponible.
- Événements spéciaux :
  - Soirée dégustation de vin chaque premier jeudi du mois.
  - Menus spéciaux pour Noël et la Saint-Valentin.
- Services additionnels :
  - Terrasse disponible en été.
  - Accès Wi-Fi gratuit.
  - Parking gratuit à proximité.
- Informations sur les allergies : Informez-nous à l'avance de vos allergies ou restrictions alimentaires.
- Modes de paiement acceptés : Carte bancaire, espèces, chèques vacances.

Répondez aux clients en utilisant ces informations. Si vous ne trouvez pas une information spécifique, répondez poliment en expliquant que vous allez transmettre leur demande au personnel.
`;

  return restaurantContext;
}

async function makeRestaurantResponse(message: string, restaurantNumber : number): Promise<string> {
  const messages: ChatCompletionMessageParam[] = [
    {
      role: "system",
      content: getRestaurantContext(restaurantNumber),
    },
    {
      role: "assistant",
      content:
        "Hi there! I can help with that. Can you please provide your order ID?",
    },
    { role: "user", content: message },
  ];

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: messages,
      tools: restaurantTools,
      tool_choice: "auto",
    });

    const responseMessage = response.choices[0].message;
    return responseMessage.content || "No response from the assistant.";
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    return "Sorry, there was an error processing your request.";
  }
}

callRouter.post("/call/incoming", (req: Request, res: Response) => {
  const calledNumber: number = req.body.To;

  /**
   * bon ça c'est la partie dans laquelle on recherche le numéro de téléphone
   * contacté dan sla base de donnée et on charge les information de la
   * compagnie associée
   */
  getRestaurantContext(calledNumber);

  const twiml = new VoiceResponse();
  twiml.say(
    "Merci d'avoir appelé, nous vous mettons en ligne avec votre assistant"
  );

  twiml.connect().stream({
    url: `wss://${process.env.SERVER_DOMAIN}/call/connection`,
  });
  res.writeHead(200, { "Content-Type": "text/xml" });
  res.end(twiml.toString());
});

callRouter.ws("/call/connection", (ws: WebSocket) => {
  ws.on("message", async (data: string) => {
    const message: {
      event: string;
      start?: { streamSid: string; callSid: string };
    } = JSON.parse(data);
    if (message.event && message.start) {
      try {
        // const textResponse = await makeRestaurantResponse(message.event);
        const streamSid = message.start.streamSid;
        const response = await elevenlabs.textToSpeech.convert(voiceId, {
          model_id: "eleven_flash_v2_5",
          output_format: outputFormat,
          text: "",
        });
        const readableStream = Readable.from(response);
        const audioArrayBuffer = await streamToArrayBuffer(readableStream);
        ws.send(
          JSON.stringify({
            streamSid,
            event: "media",
            media: {
              payload: Buffer.from(audioArrayBuffer as ArrayBuffer).toString(
                "base64"
              ),
            },
          })
        );
      } catch (error) {
        console.error("Error processing message:", error);
      }
    }
  });
  ws.on("error", console.error);
});

function streamToArrayBuffer(readableStream: Readable): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    readableStream.on("data", (chunk) => {
      chunks.push(chunk);
    });
    readableStream.on("end", () => {
      resolve(Buffer.concat(chunks).buffer);
    });
    readableStream.on("error", reject);
  });
}

export default callRouter;
