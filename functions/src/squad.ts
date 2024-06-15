import {db} from "./db";
import {User, Squad} from "./types";
import {Timestamp} from "firebase-admin/firestore";

/**
 * Invite a user to join an existing squad.
 *
 * @async
 * The Telegram ID of the user sending the invitation,
 * @param {string} telegramID
 * The ID of the user being invited to the squad,
 * @param {string} userId
 * A promise that resolves to an object indicating the status of the invitation,
 * @return {Promise<{ status: string, message: string }>}
 */
async function inviteSquad(
  telegramID: string,
  userId: string
): Promise<{ status: string; message: string }> {
  const userRef = db.collection("users").doc(telegramID);
  const userDoc = await userRef.get();
  if (!userDoc.exists) {
    return {status: "error", message: "Inviting user not found"};
  }

  const inviteeRef = db.collection("users").doc(userId);
  const inviteeDoc = await inviteeRef.get();
  if (!inviteeDoc.exists) {
    return {status: "error", message: "Invitee user not found"};
  }

  const userData = userDoc.data() as User;
  const inviteeData = inviteeDoc.data() as User;

  if (!userData.squadId) {
    return {status: "error", message: "Inviting user is not in a squad"};
  }

  const squadRef = db.collection("squads").doc(userData.squadId);
  const squadDoc = await squadRef.get();
  if (!squadDoc.exists) {
    return {status: "error", message: "Squad not found"};
  }

  const squadData = squadDoc.data() as Squad;
  if (squadData.members.includes(userId)) {
    return {status: "exists", message: "User already in squad"};
  }

  squadData.members.push(userId);
  inviteeData.squadId = userData.squadId;

  await squadRef.set(squadData, {merge: true});
  await inviteeRef.set(inviteeData, {merge: true});

  return {status: "success", message: "User invited to squad"};
}

/**
 * Remove the user from their current squad.
 *
 * @async
 * The Telegram ID of the user leaving the squad,
 * @param {string} telegramID
 * A promise that resolves to an object indicating
 * the status of leaving the squad,
 * @return {Promise<{ status: string, message: string }>}
 */
async function leaveSquad(
  telegramID: string
): Promise<{ status: string; message: string }> {
  const userRef = db.collection("users").doc(telegramID);
  const userDoc = await userRef.get();

  if (!userDoc.exists) {
    return {status: "error", message: "User not found"};
  }

  const userData = userDoc.data() as User;
  if (!userData.squadId) {
    return {status: "error", message: "User is not in a squad"};
  }

  const squadRef = db.collection("squads").doc(userData.squadId);
  const squadDoc = await squadRef.get();
  if (!squadDoc.exists) {
    return {status: "error", message: "Squad not found"};
  }

  const squadData = squadDoc.data() as Squad;
  squadData.members = squadData.members.filter(
    (member) => member !== telegramID
  );
  userData.squadId = null;

  await squadRef.set(squadData, {merge: true});
  await userRef.set(userData, {merge: true});

  return {status: "success", message: "User left squad"};
}

/**
 * Create a new squad and add the user to it.
 *
 * @async
 * The Telegram ID of the user creating the squad,
 * @param {string} telegramID
 * @param {string} name - The name of the new squad,
 * A promise that resolves to an object indicating the status of squad creation,
 * @return {Promise<{ status: string, message: string }>}
 */
async function createSquad(
  telegramID: string,
  name: string
): Promise<{ status: string; message: string }> {
  const userRef = db.collection("users").doc(telegramID);
  const userDoc = await userRef.get();

  if (!userDoc.exists) {
    return {status: "error", message: "User not found"};
  }

  const userData = userDoc.data() as User;
  if (userData.squadId) {
    return {status: "error", message: "User is already in a squad"};
  }

  const squadRef = db.collection("squads").doc();
  const newSquad: Squad = {
    name: name,
    members: [telegramID],
    inviter: telegramID,
    sources: {},
    date: Timestamp.now(),
    lastUpdate: Timestamp.now(),
  };

  await squadRef.set(newSquad);
  userData.squadId = squadRef.id;
  await userRef.set(userData, {merge: true});

  return {status: "success", message: "Squad created"};
}

export {inviteSquad, leaveSquad, createSquad};
