import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import { getSpecificContext } from "./context-util";
import openaiTools from "./openai-tools";
import logger from "@infrastructure/logger/logger";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Génère une réponse à partir d'un message utilisateur et d'un contexte.
 * @param message - Message utilisateur.
 * @param phoneNumber - Numéro associé à la session.
 * @returns Une réponse générée par OpenAI.
 */
export async function makeResponse(
  message: string,
  phoneNumber: string
): Promise<string> {
  const messages: ChatCompletionMessageParam[] = [
    { role: "system", content: getSpecificContext() },
    { role: "user", content: message },
  ];

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages,
      tools: openaiTools,
      tool_choice: "auto",
      temperature: 0.7,
      max_tokens: 100,
    });

    return response.choices[0].message.content || "Réponse non disponible.";
  } catch (error) {
    logger.error("Erreur lors de la génération de réponse :", error);
    return "Erreur de génération de la réponse.";
  }
}
