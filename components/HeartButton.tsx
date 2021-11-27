import { db, auth } from "../lib/firebase";
import {
  doc,
  DocumentReference,
  FieldValue,
  writeBatch,
  increment,
} from "@firebase/firestore";
import { useDocument } from "react-firebase-hooks/firestore";

const HeartButton: React.FC<{ postRef: DocumentReference }> = ({ postRef }) => {
  const heartRef = doc(db, `${postRef.path}/hearts/${auth.currentUser?.uid}`);
  const [heartDoc] = useDocument(heartRef);

  const addHeart = async () => {
    const uid = auth.currentUser?.uid;
    const batch = writeBatch(db);

    batch.update(postRef, { heartCount: increment(1) });
    batch.set(heartRef, { uid });

    await batch.commit();
  };
  const removeHeart = async () => {
    const batch = writeBatch(db);

    batch.update(postRef, { heartCount: increment(-1) });
    batch.delete(heartRef);

    await batch.commit();
  };

  return (
    <>
      {heartDoc?.exists() ? (
        <button onClick={removeHeart}>💔 unheart </button>
      ) : (
        <button onClick={addHeart}>❤️ Heart</button>
      )}
    </>
  );
};

export default HeartButton;
