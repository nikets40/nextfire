import type { NextPage } from "next";
import { AuthCheck } from "../../components/AuthCheck";
import kebabCase from "lodash.kebabcase";
import {
  collection,
  doc,
  query,
  orderBy,
  serverTimestamp,
  setDoc,
} from "@firebase/firestore";
import { db, auth } from "../../lib/firebase";
import {
  useCollection,
  useCollectionData,
} from "react-firebase-hooks/firestore";
import PostFeed from "../../components/PostFeed";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../lib/context";
import styles from "../../styles/Admin.module.css";
import toast from "react-hot-toast";

const AdminPostPage: NextPage = () => {
  return (
    <main>
      <AuthCheck fallback={<div />}>
        <h1>Admin Post</h1>
        <PostList />
        <CreateNewPost />
      </AuthCheck>
    </main>
  );
};

export default AdminPostPage;

const PostList: React.FC = () => {
  const ref = collection(db, `users/${auth.currentUser?.uid}/posts`);

  const q = query(ref, orderBy("createdAt"));
  const [querySnapshot] = useCollection(q);
  const posts = querySnapshot?.docs.map((doc) => doc.data());
  console.log("posts", posts);

  return (
    <>
      <h1>Manage Posts</h1>
      {posts && <PostFeed posts={posts} admin />}
    </>
  );
};

const CreateNewPost: React.FC = () => {
  const router = useRouter();
  const username = useContext(UserContext)?.username;
  const [title, setTitle] = useState("");

  const slug = encodeURI(kebabCase(title));

  const isValid = title.length > 3 && slug.length < 100;

  const createPost = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const uid = auth.currentUser?.uid;
    const ref = doc(db, `users/${uid}/posts/${slug}`);
    const postData = {
      title,
      slug,
      uid,
      username,
      published: false,
      content: "# Hello World!",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      heartCount: 0,
    };

    await setDoc(ref, postData);
    toast.success("Post created!");

    router.push(`/admin/${slug}`);
  };

  return (
    <form onSubmit={createPost}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="My Awesome Article"
        className={styles.input}
      />
      <p>
        <strong>Slug:</strong> {slug}
      </p>

      <button type="submit" disabled={!isValid} className="btn-green">
        Create New Post
      </button>
    </form>
  );
};
