import OpenAI from "openai";
const openai = new OpenAI();

import { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import getSpecificContext from "./context-getter";
import restaurantTools from "../tools/restaurant-tools";

/**
 * @function makeRestaurantResponse elaborate a response from the user prompt/question
 * @param message
 * @param restaurantNumber
 * @returns
 */
async function makeRestaurantResponse(
  message: string,
  restaurantNumber: number
): Promise<string> {
  const messages: ChatCompletionMessageParam[] = [
    {
      role: "system",
      content: getSpecificContext(),
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
