import {db} from "./db";
import {User} from "./types";
import {FieldValue, Timestamp} from "firebase-admin/firestore";

/**
 * Initialize a user, updating their login rewards and creating a new user if
 * not already existing.
 *
 * @async
 * @param {string} telegramID - The Telegram ID of the user.
 * @param {string | null} inviter - The Telegram ID of the inviter if any,
 * defaults to null.
 * @return {Promise<{ status: string, message: string }>} A promise that
 * resolves to an object indicating the status of user initialization.
 */
export async function initUser(
  telegramID: string,
  inviter: string | null = null
): Promise<{ status: string; message: string }> {
  const userRef = db.collection("users").doc(telegramID);
  const userDoc = await userRef.get();

  if (userDoc.exists) {
    // User reward for every day login
    const userData = userDoc.data() as User;
    const now = new Date();
    const lastDate = userData.rowLog.lastDate ?
      userData.rowLog.lastDate.toDate() :
      null;

    if (lastDate) {
      const diffInMillis = now.getTime() - lastDate.getTime();
      const diffInHours = diffInMillis / (1000 * 60 * 60);

      if (diffInHours < 24) {
        return {
          status: "exists",
          message: `User already logged in today, next time ${Math.round(
            24 - diffInHours
          )} hours`,
        };
      } else if (diffInHours >= 24 && diffInHours < 48) {
        // Update log, because more than a day has passed, but less than two
        await userRef.update({
          "rowLog.count": FieldValue.increment(1),
          "rowLog.lastDate": Timestamp.now(),
          "coins": FieldValue.increment(10),
        });
        return {status: "exists", message: "Rewards updated for daily login"};
      } else {
        // Update log and reset count
        await userRef.update({
          rowLog: {
            count: 1,
            lastDate: Timestamp.now(),
          },
        });
        return {
          status: "exists",
          message: "Streak reset and logged in today",
        };
      }
    } else {
      // If not lastDate, then update log
      await userRef.update({
        rowLog: {
          count: 1,
          lastDate: Timestamp.now(),
        },
      });
      return {status: "exists", message: "Rewards updated for daily login"};
    }
  } else {
    // Create new user
    const newUser: User = {
      telegramId: telegramID,
      coins: 0,
      inviter: "",
      refferals: [],
      rowLog: {
        count: 0,
        lastDate: Timestamp.now(),
      },
      fragments: {},
      treasures: [],
      squadId: null,
      succsesQRs: [],
    };

    let inviterRef;
    let inviterDoc;

    if (inviter) {
      inviterRef = db.collection("users").doc(inviter);
      inviterDoc = await inviterRef.get();
      if (inviterDoc.exists) {
        const inviterData = inviterDoc.data() as User;
        inviterData.refferals.push(telegramID);

        // add inviter to new user
        newUser.inviter = inviter;
        newUser.coins = 10;
        await inviterRef.update({
          refferals: FieldValue.arrayUnion(telegramID),
          coins: FieldValue.increment(10),
        });
      }
    }

    await userRef.set(newUser);

    return {
      status: "created",
      message: inviterDoc?.exists ?
        "User created with inviter" :
        "User created without inviter",
    };
  }
}
