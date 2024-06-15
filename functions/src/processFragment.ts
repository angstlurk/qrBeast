import {db} from "./db";
import {User, FragmentRoot} from "./types";
import {FieldValue} from "firebase-admin/firestore";

/**
 * Process a fragment for a user, adding it to
 * the user's collection and handling
 * rewards if applicable.
 *
 * @async
 * @param {Object} data - The data object containing user's Telegram ID,
 * fragment root ID, and fragment ID.
 * @param {string} data.telegramId - The Telegram ID of the user processing the
 * fragment.
 * @param {string} data.fragmentRootId - The ID of the fragment root.
 * @param {string} data.fragmentId - The ID of the fragment being processed.
 * @return {Promise<{ status: string, message: string }>} A promise that
 * resolves to an object indicating the status of fragment processing.
 */
export async function processFragment(data: {
  telegramId: string;
  fragmentRootId: string;
  fragmentId: string;
}) {
  const {telegramId, fragmentRootId, fragmentId} = data;

  const userRef = db.collection("users").doc(telegramId);
  const fragmentRootRef = db.collection("fragments").doc(fragmentRootId);

  const userDoc = await userRef.get();
  const fragmentRootDoc = await fragmentRootRef.get();

  if (!userDoc.exists) {
    return {status: "error", message: "User not found"};
  }

  if (!fragmentRootDoc.exists) {
    return {status: "error", message: "FragmentRoot not found"};
  }

  const user = userDoc.data() as User;
  const fragmentRoot = fragmentRootDoc.data() as FragmentRoot;

  // Fragment not found
  if (!fragmentRoot.fragments.includes(fragmentId)) {
    return {status: "error", message: "Fragment not found"};
  }

  // init fragmentRoot to user
  if (!user.fragments[fragmentRootId]) {
    await userRef.update({
      [`fragments.${fragmentRootId}`]: [fragmentId],
    });
    return {status: "success", message: "Fragment added to user"};
  }

  // user already claimed reward
  if (
    fragmentRoot.fragments.every((userFragmentId) =>
      user.fragments[fragmentRootId].includes(userFragmentId)
    )
  ) {
    return {status: "error", message: "User already claimed this reward"};
  }

  // user already claimed fragment
  if (user.fragments[fragmentRootId].includes(fragmentId)) {
    return {status: "error", message: "User already claimed this fragment"};
  }

  // no more rewards available
  if (fragmentRoot.remainingCount === 0) {
    return {status: "error", message: "No more rewards available"};
  }

  // reward
  if (
    user.fragments[fragmentRootId].length ===
    fragmentRoot.fragments.length - 1
  ) {
    await userRef.update({
      [`fragments.${fragmentRootId}`]: FieldValue.arrayUnion(fragmentId),
      coins: FieldValue.increment(fragmentRoot.rewardCoin),
    });
    await fragmentRootRef.update({
      [`${fragmentRootId}.remainingCount`]: FieldValue.increment(-1),
    });
    return {status: "success", message: "Reward processed successfully"};
  }

  // add fragment to user
  await userRef.update({
    [`fragments.${fragmentRootId}`]: FieldValue.arrayUnion(fragmentId),
  });

  return {status: "success", message: "Fragment processed successfully"};
}
