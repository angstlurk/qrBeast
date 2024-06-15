import {db} from "./db";
import {User, Treasure} from "./types";
import {FieldValue} from "firebase-admin/firestore";

/**
 * Process a treasure QR code for a user, updating their treasures and coins.
 *
 * @async
 * The Telegram ID of the user processing the treasure.
 * @param {string} telegramID
 * The ID of the treasure QR code being processed.
 * @param {string} treasureID
 * A promise that resolves to an object indicating the
 * status of treasure processing.
 * @return {Promise<{ status: string, message: string }>}
 */
export async function processTreasure(
  telegramID: string,
  treasureID: string
): Promise<{ status: string; message: string }> {
  const userRef = db.collection("users").doc(telegramID);
  const treasureRef = db.collection("treasures").doc(treasureID);

  const userDoc = await userRef.get();
  const treasureDoc = await treasureRef.get();

  if (!userDoc.exists) {
    return {status: "error", message: "User not found"};
  }

  if (!treasureDoc.exists) {
    return {status: "error", message: "Treasure not found"};
  }

  const userTresaures = userDoc.get("treasures") as User["treasures"];
  const treasureData = treasureDoc.data() as Treasure;

  // Checking if user already used this QR code
  if (userTresaures && userTresaures.includes(treasureID)) {
    return {
      status: "exists",
      message: "Treasure QR code already used by user",
    };
  }

  // checking if treasure is still available
  if (
    treasureData.remainingCount <= 0 &&
    treasureData.remainingCount !== null
  ) {
    return {
      status: "unavailable",
      message: "Treasure no longer available",
    };
  }

  await userRef.update({
    treasures: FieldValue.arrayUnion(treasureID),
    coins: FieldValue.increment(treasureData.reward),
  });

  if (treasureData.remainingCount !== null) {
    await treasureRef.update({remainingCount: FieldValue.increment(-1)});
  }

  return {status: "success", message: "Treasure QR code processed"};
}

/**
 * Create a new treasure with specified reward and remaining count for a user.
 *
 * @async
 * The data object containing reward, remaining count, and user ID.
 * @param {Object} data
 * The reward associated with the treasure.
 * @param {number} data.reward
 * The remaining count of this treasure.
 * @param {number} data.remainingCount
 * The ID of the user creating the treasure.
 * @param {string} data.userId
 * A promise that resolves to an object indicating
 * the status of treasure creation.
 * @return {Promise<{ status: string, message: string }>}
 */
export async function createTreasure(data: {
  reward: number;
  remainingCount: number;
  userId: string;
}) {
  const {reward, remainingCount, userId} = data;
  const userRef = db.collection("users").doc(userId);
  const userDoc = await userRef.get();

  if (!userDoc.exists) {
    return {status: "error", message: "User not found"};
  }

  if (reward <= 0 || remainingCount <= 0) {
    return {
      status: "failed",
      message: "reward and remaingCount should be positive",
    };
  }

  const totalReward = data.reward * data.remainingCount;

  if (totalReward > userDoc.get("coins")) {
    return {
      status: "failed",
      message: "Not enough coins",
    };
  }

  await userRef.update({
    coins: FieldValue.increment(-totalReward),
  });

  const treasureRef = db.collection("treasures").doc();
  await treasureRef.set(data);

  return {status: "success", message: `Treasure created ${treasureRef.id} `};
}
