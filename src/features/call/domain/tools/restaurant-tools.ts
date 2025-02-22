import { ChatCompletionTool } from "openai/resources/chat/completions";
import { FunctionDefinition } from "openai/resources";

/**
 * Outil pour vérifier la disponibilité d'une date et d'une heure.
 */
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

/**
 * Outil pour récupérer les dates et heures disponibles.
 */
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

/**
 * Liste des outils disponibles pour OpenAI.
 */
const openaiTools: ChatCompletionTool[] = [
  { function: getAvailablesDatesAndTimes, type: "function" },
  { function: isDateTimeAvailableTool, type: "function" },
];

export default openaiTools;
