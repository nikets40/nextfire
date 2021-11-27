import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { auth, db } from "./firebase";

export function useUserData() {
  const [user] = useAuthState(auth);
  const [username, setUserName] = useState("");


  useEffect(() => {
    console.log("user Auth State changed");

    const getUserName = async () => {
      let unsubscribe;
      if (user) {
        const _ref = doc(db, `users`, user.uid);
        unsubscribe = onSnapshot(_ref, (doc) => {
          if (doc.exists()) {
            setUserName(doc.data()?.username);
          }
        });

      } else {
        setUserName("");
      }
      return unsubscribe;
    };

    getUserName();
  }, [user]);

  return { user, username };
}
