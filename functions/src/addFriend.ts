import * as admin from "firebase-admin";
import {FieldValue} from "firebase-admin/firestore";

/**
 * Add a referral to the database, updating inviter's points if valid.
 *
 * @async
 * @param {string} referral - The ID of the user being referred.
 * @param {string} inviter - The ID of the user who referred the new user.
 * @return {Promise<boolean>} A promise that resolves to true if the referral
 * was successfully added, false otherwise.
 */
export async function addReferal(
  referral: string,
  inviter: string
): Promise<boolean> {
  const db = admin.firestore();
  const referralRef = db.collection("usersId").doc(referral);
  const referralDocument = await referralRef.get();

  const inviterReference = db.collection("usersId").doc(inviter);
  const inviterDocument = await inviterReference.get();

  // if users came by themselves and it is not a valid inviter
  if (!inviterDocument.exists) {
    if (!referralDocument.exists) {
      await referralRef.set({
        points: 0,
        inviter: inviter,
        acceptedInvites: [],
      });
    }
    return Promise.resolve(false);
  }

  if (referralDocument.exists) {
    const referalData = referralDocument.data();
    if (referalData?.inviter) {
      return Promise.resolve(false);
    }

    await inviterReference.update({
      points: FieldValue.increment(100),
      acceptedInvites: FieldValue.arrayUnion(referral),
    });

    await referralRef.update({
      points: FieldValue.increment(100),
      inviter: inviter,
    });
    return Promise.resolve(true);
  }

  if (!referralDocument.exists) {
    if (inviterDocument.exists) {
      await referralRef.set({
        points: 100,
        inviter: inviter,
        acceptedInvites: [],
      });
      await inviterReference.update({
        points: FieldValue.increment(100),
        acceptedInvites: FieldValue.arrayUnion(referral),
      });
    } else {
      await referralRef.set({
        points: 0,
        inviter: inviter,
        acceptedInvites: [],
      });
    }
    return Promise.resolve(false);
  }

  if (inviterDocument.exists) {
    return Promise.resolve(true);
  }
  return Promise.resolve(false);
}
