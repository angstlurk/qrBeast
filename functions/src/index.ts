/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { onRequest } from "firebase-functions/v2/https";
import { initUser as initUserApi, type ResultInit } from "./initUser";
import { processQR as processQRApi } from "./processQr";
import {
  processTreasure as processTreasureApi,
  createTreasure as createTreasureApi,
} from "./processTreasure";
import { processFragment as processFragmentApi } from "./processFragment";
import { auth } from "./auth";

export type InitUserRequest = {
  inviterId: string;
};

type Auth = {
  auth: string;
};

export type InitUserResponse =
  | {
      success: false;
      message: string;
    }
  | ({
      success: true;
    } & ResultInit);

export const initUser = onRequest({ cors: true }, async (request, response) => {
  const data: InitUserRequest & Auth = request.body.data;

  const userId = auth(data.auth);

  if (userId === null) {
    response
      .status(403)
      .send({ data: { success: false, message: "Unauthorized" } });
    return;
  }
  const result = await initUserApi(userId, data.inviterId);

  response.status(200).send({ data: { ...result, success: true } });
});

export type ProcessQRRequst = {
  qr: string;
};

export const processQR = onRequest(
  { cors: true },
  async (request, response) => {
    const data = request.body.data as ProcessQRRequst & Auth;
    const qr = data.qr;

    const userId = auth(data.auth);

    if (userId === null) {
      response.status(401).send("Unauthorized");
      return;
    }
    if (!qr) {
      response.status(400).send("Bad Request");
      return;
    }

    const result = await processQRApi(userId, qr);

    response.status(200).send({ data: { ...result } });
  }
);

export type ProcessTreasureRequst = {
  treasure: string;
};

export const processTreasure = onRequest(
  { cors: true },
  async (request, response) => {
    const data = request.body.data as ProcessTreasureRequst & Auth;

    const treasure = data.treasure;
    const userId = auth(data.auth);

    if (userId === null) {
      response.status(401).send("Unauthorized");
      return;
    }
    if (!treasure) {
      response.status(400).send("Bad Request");
      return;
    }

    const result = await processTreasureApi(userId, treasure);

    response.status(200).send({ data: { ...result } });
  }
);

export type ProcessFragmentRequst = {
  fragmentRootId: string;
  fragmentId: string;
};

export const processFragment = onRequest(
  { cors: true },
  async (request, response) => {
    const data = request.body.data as ProcessFragmentRequst & Auth;
    const fragmentRootId = data.fragmentRootId;
    const fragmentId = data.fragmentId;
    const userId = auth(data.auth);

    if (userId === null) {
      response.status(401).send("Unauthorized");
      return;
    }
    if (!fragmentRootId || !fragmentId) {
      response.status(400).send("Bad Request");
      return;
    }

    const result = await processFragmentApi({
      telegramId: userId,
      fragmentRootId,
      fragmentId,
    });

    response.status(200).send({ data: { ...result } });
  }
);

export type CreateTreasureRequst = {
  reward: number;
  remainingCount: number;
};

export const createTreasure = onRequest(
  { cors: true },
  async (request, response) => {
    const data = request.body.data as CreateTreasureRequst & Auth;
    const reward = data.reward;
    const remainingCount = data.remainingCount;
    const userId = auth(data.auth);

    if (!reward || !remainingCount) {
      response.status(400).send("Bad Request");
      return;
    }

    if (userId === null) {
      response.status(401).send("Unauthorized");
      return;
    }

    const result = await createTreasureApi({
      reward,
      remainingCount,
      userId,
    });

    response.status(200).send({ data: { ...result } });
  }
);

// export const createSquad = onRequest(
//   { cors: true },
//   async (request, response) => {
//     const userId = mockAuth(request.body.data.userId);
//     const name = request.body.data.name;

//     if (userId === null) {
//       response.status(401).send("Unauthorized");
//       return;
//     }
//     if (!name) {
//       response.status(400).send("Bad Request");
//       return;
//     }

//     const result = await createSquadApi(userId, name);

//     response.status(200).send({ data: { ...result } });
//   }
// );
