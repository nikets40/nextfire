import type { NextPage } from "next";
import { googleAuthProvider, auth, db } from "../lib/firebase";
import { signInWithPopup } from "@firebase/auth";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { UserContext } from "../lib/context";
import { doc, getDoc, writeBatch } from "firebase/firestore";
import debounce from "lodash.debounce";
import router from "next/router";

export const EnterPage: NextPage = () => {
  const userData = useContext(UserContext);

  return (
    <main>
      {userData?.user ? (
        !userData?.username ? (
          <UsernameForm />
        ) : (
          <SignOutButton />
        )
      ) : (
        <SignInButton />
      )}
    </main>
  );
};

const SignInButton: React.FC = () => {
  const googleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleAuthProvider);
    } catch (error) {
      console.error("error with sign in with google", error);
    }
  };
  return (
    <button className="btn-google" onClick={googleSignIn}>
      <img src="/static/images/google.png" alt="" /> Sign in with Google
    </button>
  );
};

const SignOutButton: React.FC = () => {
  return (
    <button
      onClick={() => {
        auth.signOut();
        router.reload();
      }}
    >
      Sign out
    </button>
  );
};

interface UserNameMessageInterface {
  username: string;
  isValid: boolean;
  loading: boolean;
}
const UsernameMessage = (props: UserNameMessageInterface) => {
  if (props.loading) {
    return <p>Checking...</p>;
  } else if (props.isValid) {
    return <p className="text-success">{props.username} is available</p>;
  } else if (props.username.length > 3 && !props.isValid) {
    return <p className="text-danger">That username is taken</p>;
  } else {
    return <p></p>;
  }
};

const UsernameForm: React.FC = () => {
  const userData = useContext(UserContext);

  const [formValue, setFormValue] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(false);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    const val = e.target.value.toLowerCase();
    const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

    if (val.length < 3) {
      setFormValue(val);
      setIsValid(false);
      setLoading(false);
    }

    if (re.test(val)) {
      setFormValue(val);
      setIsValid(false);
      setLoading(true);
    }
  };

  useEffect(() => {
    checkUserName(formValue);
  }, [formValue]);

  const checkUserName = useCallback(
    debounce(async (username) => {
      if (username?.length >= 3) {
        const ref = doc(db, `usernames/${username}`);
        const docSnap = await getDoc(ref);
        console.log("firestore read executed!");
        setIsValid(!docSnap.exists());
        setLoading(false);
      }
    }, 500),
    []
  );

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const userDoc = doc(db, `users/${userData?.user.uid}`);
    const userNameDoc = doc(db, `/usernames/${formValue}`);

    try {
      const batch = writeBatch(db);
      batch.set(userDoc, {
        username: formValue,
        photoURL: userData?.user.photoURL,
        displayName: userData?.user.displayName,
      });
      batch.set(userNameDoc, { uid: userData?.user.uid });

      await batch.commit();
    } catch (error) {
      console.error("error with write batch", error);
    }
  };

  return !userData?.username ? (
    <section>
      <h3>Choose a username</h3>
      <form onSubmit={onSubmit} autoComplete="off">
        <input
          type="text"
          name="username"
          placeholder="username"
          value={formValue}
          onChange={onChange}
        />
        <UsernameMessage
          username={formValue}
          isValid={isValid}
          loading={loading}
        />
        <button type="submit" className="btn-green" disabled={!isValid}>
          Choose
        </button>
        {/* 
        <h3>Debug state</h3>
        <div>
          Username: {formValue}
          <br />
          Loading: {loading.toString()}
          <br />
          Username Valid: {isValid.toString()}
        </div> */}
      </form>
    </section>
  ) : null;
};

export default EnterPage;
