import {db} from "./db";
import {User} from "./types";
import {FieldValue} from "firebase-admin/firestore";

/**
 * Processes a QR code for a user.
 *
 * @param {string} telegramID - The Telegram ID of the user.
 * @param {string} qr - The QR code to process.
 * @return {Promise<{status: string, message: string}>}
 * The status and message of the operation.
 */
export async function processQR(
  telegramID: string,
  qr: string
): Promise<{ status: string; message: string }> {
  const userRef = db.collection("users").doc(telegramID);
  const userDoc = await userRef.get();

  if (!userDoc.exists) {
    return {status: "error", message: "User not found"};
  }

  const userData = userDoc.data() as User;
  if (userData.succsesQRs.includes(qr)) {
    return {status: "exists", message: "QR code already used by user"};
  }

  await userRef.update({
    coins: FieldValue.increment(1),
    succsesQRs: FieldValue.arrayUnion(qr),
  });

  return {
    status: "success",
    message: "QR code processed, 1 coin added to balance",
  };
}
