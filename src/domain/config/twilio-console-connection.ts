import "dotenv/config";
import util from "node:util";
import child_process from "node:child_process";
const exec = util.promisify(child_process.exec);

async function lsExample() {
  const { stdout, stderr } = await exec("ls");
  console.log("stdout:", stdout);
  console.error("stderr:", stderr);
}

const ACCOUNT_SID = process.env.ACCOUNT_SID;
const AUTH_TOKEN = process.env.AUTH_TOKEN;
const TWILIO_SHORTLAND = process.env.TWILIO_SHORTLAND;

async function connectToTwilioConsole() {
  console.log("connexion avec twilio cli");
  await exec(
    `twilio login ${ACCOUNT_SID} --auth-token ${AUTH_TOKEN} -p ${TWILIO_SHORTLAND}`
  );

  await exec(`twilio profiles:use ${TWILIO_SHORTLAND}`);
  console.log("connexion avec twilio cli terminée");
}

export default connectToTwilioConsole;
