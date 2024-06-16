import {validate, parse} from "@tma.js/init-data-node";
import * as logger from "firebase-functions/logger";
import * as dotenv from "dotenv";
dotenv.config();

const telegramToken = process.env.TELEGRAM_TOKEN || "";

export const auth = (authorization: string | undefined): string | null => {
  const [authType, authData = ""] = (authorization || "").split(" ");

  if (authType !== "tma" || !authData) {
    return null;
  }

  try {
    validate(authData, telegramToken, {expiresIn: 3600});
  } catch (error) {
    logger.error(error);
    return null;
  }

  const data = parse(authData);
  if (data.user?.id === undefined) {
    return null;
  }
  return data.user.id.toString();
};
