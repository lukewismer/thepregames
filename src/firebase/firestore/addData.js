import firebase_app from "../config";
import { getFirestore, doc, setDoc, collection, addDoc } from "firebase/firestore";

const db = getFirestore(firebase_app);

export default async function addData(collectionName, id = undefined, data) {
  let result = null;
  let error = null;

  try {
    if (id) {
      // If an ID is provided, use setDoc
      result = await setDoc(doc(db, collectionName, id), data, { merge: true });
    } else {
      // If no ID is provided, use addDoc to generate an auto-ID
      result = await addDoc(collection(db, collectionName), data);
    }
  } catch (e) {
    error = e;
  }

  return { result, error };
}