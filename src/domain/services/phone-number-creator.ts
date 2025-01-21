import util from "node:util";
import child_process from "node:child_process";
const exec = util.promisify(child_process.exec);

const SERVER_DOMAIN = process.env.SERVER_DOMAIN;

/**
 * @function registerNewPhoneNumber new twilio phones number creator and configurator
 * @param phoneNumber
 */
async function registerNewPhoneNumber(phoneNumber: string) {
  await exec(
    `twilio api:core:incoming-phone-numbers:create --phone-number=${phoneNumber}`
  ).then(({ stdout, stderr }: { stdout: string; stderr: string }) => {
    if (stderr) {
      console.log(
        `erreur lors de l'enregistrement du numero sur twilio : ${stderr}`
      );
      throw stderr;
    } else {
      console.log(`${phoneNumber} enregistré avec succès sur twilio`);
    }
  });
  await exec(
    `twilio phone-numbers:update ${phoneNumber} --voice-url=${SERVER_DOMAIN}/call/incoming --voice-method=POST`
  ).then(({ stdout, stderr }: { stdout: string; stderr: string }) => {
    if (stderr) {
      console.log(
        `erreur lors de l'enregistrement du numero sur twilio : ${stderr}`
      );
      throw stderr;
    } else {
      console.log(`${phoneNumber} paramétré avec succès`);
    }
  });
}

export default registerNewPhoneNumber;
