import firebase_app from "../config";
import { getFirestore, collection, doc, getDoc, getDocs } from "firebase/firestore";

const db = getFirestore(firebase_app)
console.log(db)
export async function getDocument(collection, id) {
    let docRef = doc(db, collection, id);

    let result = null;
    let error = null;

    try {
        result = await getDoc(docRef);
    } catch (e) {
        error = e;
    }

    return { result, error };
}

export async function getCollectionData(collectionName) {
    let result = [];
    let error = null;

    try {
        const querySnapshot = await getDocs(collection(db, collectionName));
        querySnapshot.forEach((doc) => {
            result.push({ id: doc.id, ...doc.data() });
        });
    } catch (e) {
        error = e;
    }

    return { result, error };
}
