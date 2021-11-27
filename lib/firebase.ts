import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage,TaskState } from "firebase/storage";
import { getFirestore, getDocs, collection, query, where, limit } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDrty5JzU4pXbcE90mvJtYunP4p-RL44Cw",
  authDomain: "nextfire-7f8bf.firebaseapp.com",
  projectId: "nextfire-7f8bf",
  storageBucket: "nextfire-7f8bf.appspot.com",
  messagingSenderId: "422722489811",
  appId: "1:422722489811:web:9dd2535582a41681473326"
};


const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleAuthProvider = new GoogleAuthProvider();
export const storage = getStorage(app);


/// helper functions

/**
 * gets a users/{uid} document with username
 * @param {string} username
 */

export async function getUserWithUsername(username: string) {
  const _ref = collection(db, `users`);
  const userQuery = query(_ref, where("username", "==", username), limit(1));
  const userDoc = (await getDocs(userQuery)).docs[0];
  return userDoc;
}

/**
 * Converts a firesbase documnet to JSON
 * @param {DocumentSnapshot} doc
 */

export function postToJSON(doc: any) {
  const data = doc.data();
  return {
    ...data,
    createdAt: data?.createdAt?.toMillis() ?? 0,
    updatedAt: data?.updatedAt?.toMillis() ?? 0,
  }
}