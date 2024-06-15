/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {onRequest} from "firebase-functions/v2/https";
import {initUser as initUserApi} from "./initUser";
import {processQR as processQRApi} from "./processQr";
import {
  processTreasure as processTreasureApi,
  createTreasure as createTreasureApi,
} from "./processTreasure";
import {processFragment as processFragmentApi} from "./processFragment";

const mockAuth = (id: string | null) => id;

export const initUser = onRequest({cors: true}, async (request, response) => {
  const userId = mockAuth(request.body.data.userId);
  const inviterId = request.body.data.inviterId;

  if (userId === null) {
    response
      .status(403)
      .send({data: {success: false, message: "Unauthorized"}});
    return;
  }
  const result = await initUserApi(userId, inviterId);

  response.status(200).send({data: {...result}});
});

export const processQR = onRequest(
  {cors: true},
  async (request, response) => {
    const qr = request.body.data.qr;
    const userId = mockAuth(request.body.data.userId);

    if (userId === null) {
      response.status(401).send("Unauthorized");
      return;
    }
    if (!qr) {
      response.status(400).send("Bad Request");
      return;
    }

    const result = await processQRApi(userId, qr);

    response.status(200).send({data: {...result}});
  }
);

export const processTreasure = onRequest(
  {cors: true},
  async (request, response) => {
    const treasure = request.body.data.treasure;
    const userId = mockAuth(request.body.data.userId);

    if (userId === null) {
      response.status(401).send("Unauthorized");
      return;
    }
    if (!treasure) {
      response.status(400).send("Bad Request");
      return;
    }

    const result = await processTreasureApi(userId, treasure);

    response.status(200).send({data: {...result}});
  }
);

export const processFragment = onRequest(
  {cors: true},

  async (request, response) => {
    const fragmentRootId = request.body.data.fragmentRootId;
    const fragmentId = request.body.data.fragmentId;
    const userId = mockAuth(request.body.data.userId);

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

    response.status(200).send({data: {...result}});
  }
);

export const createTreasure = onRequest(
  {cors: true},
  async (request, response) => {
    const reward = request.body.data.reward;
    const remainingCount = request.body.data.remainingCount;
    const userId = mockAuth(request.body.data.userId);

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

    response.status(200).send({data: {...result}});
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
