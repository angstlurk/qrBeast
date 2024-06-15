import {validate, parse} from "@tma.js/init-data-node";
import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import {getAuth} from "firebase-admin/auth";
import * as dotenv from "dotenv";
dotenv.config();

const telegramToken = process.env.TELEGRAM_TOKEN || "";

const checkAuth = (authorization: string | undefined): string | null => {
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

export const auth = onRequest((request, response) => {
  const userId = checkAuth(request.header("authorization"));

  if (userId === null) {
    response.status(401).send("Unauthorized");
    return;
  }

  getAuth()
    .createCustomToken(userId)
    .then((customToken) => {
      logger.info("done");
      response.send(customToken);
    })
    .catch((error) => {
      logger.error(error);
      response.send(error);
    });
});
