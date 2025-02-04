import { Twilio } from "twilio";
import type { MessageInstance } from "twilio/lib/rest/api/v2010/account/message";
import type { IncomingPhoneNumberInstance } from "twilio/lib/rest/api/v2010/account/incomingPhoneNumber";
import "dotenv/config";
import { BalanceInstance } from "twilio/lib/rest/api/v2010/account/balance";

class TwilioService {
  private static instance: TwilioService;
  private client: Twilio;
  private readonly accountSid: string;
  private readonly authToken: string;
  private readonly serverDomain: string;

  private constructor() {
    this.accountSid = process.env.ACCOUNT_SID!;
    this.authToken = process.env.AUTH_TOKEN!;
    this.serverDomain = process.env.SERVER_DOMAIN!;

    if (!this.accountSid || !this.authToken || !this.serverDomain) {
      throw new Error("Missing Twilio environment variables");
    }

    this.client = new Twilio(this.accountSid, this.authToken);
  }

  public static getInstance(): TwilioService {
    if (!TwilioService.instance) {
      TwilioService.instance = new TwilioService();
    }
    return TwilioService.instance;
  }

  public async validateConnection(): Promise<void> {
    try {
      await this.client.api.accounts(this.accountSid).fetch();
      console.log("Successfully connected to Twilio");
    } catch (error) {
      console.error("Failed to connect to Twilio:", error);
      throw error;
    }
  }

  /**
   * retourne un numéro disponible pour ce country code précis
   * @param countryCode
   * @returns generated phone number
   */
  public async generatePhoneNumber(countryCode: string): Promise<string> {
    const startBalanceValue = parseInt(
      (await this.getCurrentBalance()).balance
    );
    try {
      // Recherche des numéros disponibles pour le pays spécifié
      const availableNumbers = await this.client
        .availablePhoneNumbers(countryCode)
        .local.list({
          limit: 10,
          voiceEnabled: true,
          smsEnabled: true,
        });

        console.log(availableNumbers)

      if (availableNumbers.length === 0) {
        throw new Error(
          `No available phone numbers found for country code: ${countryCode}`
        );
      }

      const phoneNumber = availableNumbers[0].phoneNumber;

      console.log(
        `Successfully generated and configured new phone number: ${phoneNumber}`
      );

      const endBalanceValue = parseInt(
        (await this.getCurrentBalance()).balance
      );

      const cost = this.calculateTwilioCost(startBalanceValue, endBalanceValue);

      console.log(`cout de la génération du numéro ${phoneNumber} : ${cost}`);

      return phoneNumber;
    } catch (error) {
      console.error(
        `Error generating phone number for country code ${countryCode}:`,
        error
      );
      throw error;
    }
  }

  /**
   * enregistrer un numéro de téléphone twilio
   * @param phoneNumber
   */
  public async registerPhoneNumber(phoneNumber: string): Promise<void> {
    try {
      const startBalanceValue = parseInt(
        (await this.getCurrentBalance()).balance
      );
      // Check if number already exists
      const existingNumbers = await this.client.incomingPhoneNumbers.list({
        phoneNumber,
      });

      let incomingNumber: IncomingPhoneNumberInstance;

      if (existingNumbers.length === 0) {
        // Create new number
        incomingNumber = await this.client.incomingPhoneNumbers.create({
          phoneNumber,
        });
        console.log(`Successfully registered ${phoneNumber} with Twilio`);
      } else {
        incomingNumber = existingNumbers[0];
        console.log(`${phoneNumber} already exists on Twilio`);
      }

      // Update number configuration
      await this.client.incomingPhoneNumbers(incomingNumber.sid).update({
        voiceUrl: `https://${this.serverDomain}/api/v1/call/incoming`,
        voiceMethod: "POST",
      });
      console.log(`Successfully configured ${phoneNumber}`);
      const endBalanceValue = parseInt(
        (await this.getCurrentBalance()).balance
      );
      const cost = this.calculateTwilioCost(startBalanceValue, endBalanceValue);

      console.log(`cout de l'enregistrement du numéro ${phoneNumber} : ${cost}`);
    } catch (error) {
      console.error(`Error registering ${phoneNumber}:`, error);
      throw error;
    }
  }

  //si un jour on a besoin d'envoyer des sms
  // public async sendSms(
  //   to: string,
  //   from: string,
  //   body: string
  // ): Promise<MessageInstance> {
  //   try {
  //     const message = await this.client.messages.create({
  //       body,
  //       to,
  //       from,
  //     });
  //     console.log(`SMS sent with SID: ${message.sid}`);
  //     return message;
  //   } catch (error) {
  //     console.error('Error sending SMS:', error);
  //     throw error;
  //   }
  // }

  // public async listPhoneNumbers(): Promise<IncomingPhoneNumberInstance[]> {
  //   try {
  //     const numbers = await this.client.incomingPhoneNumbers.list();
  //     return numbers;
  //   } catch (error) {
  //     console.error('Error retrieving phone numbers:', error);
  //     throw error;
  //   }
  // }

  /**
   * 
   * @returns the currnt twilio account's balance
   */
  private async getCurrentBalance(): Promise<BalanceInstance> {
    try {
      const balance = await this.client.balance.fetch();
      return balance;
    } catch (error) {
      console.error("Erreur lors de la récupération du solde :", error);
      throw error;
    }
  }

  private calculateTwilioCost(
    startBalance: number,
    endBalance: number
  ): string {
    const cost = (endBalance - startBalance).toFixed(2);
    return cost;
  }
}

export default TwilioService;
