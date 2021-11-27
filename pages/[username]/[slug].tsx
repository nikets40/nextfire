import { collectionGroup, doc, getDoc, getDocs } from "@firebase/firestore";
import { NextPage, GetStaticProps, GetStaticPaths } from "next";
import { db, getUserWithUsername, postToJSON } from "../../lib/firebase";
import { useDocumentData } from "react-firebase-hooks/firestore";
import styles from "../../styles/Post.module.css";
import PostContent from "../../components/PostContent";
import { AuthCheck } from "../../components/AuthCheck";
import HeartButton from "../../components/HeartButton";
import Link from "next/link";

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const username = params?.username;
  const slug = params?.slug;
  const userDoc = await getUserWithUsername(username as string);

  if (!userDoc) {
    return {
      notFound: true,
    };
  }

  let post;
  let path;

  if (userDoc) {
    const postRef = doc(db, `${userDoc.ref.path}/posts/${slug}`);
    console.log("postRef Path:- ", postRef.path);
    post = postToJSON(await getDoc(postRef));
    path = postRef.path;
  }

  return { props: { post, path }, revalidate: 5000 };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const snapshot = await getDocs(collectionGroup(db, "posts"));

  const paths = snapshot.docs.map((doc) => {
    const { username, slug } = doc.data();
    return {
      params: { username, slug },
    };
  });
  return { paths, fallback: "blocking" };
};

const Post: NextPage<any> = (props) => {
  const postRef = doc(db, props.path);
  const [realTimePost] = useDocumentData(postRef);
  const post = realTimePost || props.post;

  return (
    <main className={styles.container}>
      <section>
        <PostContent post={post} />
      </section>

      <aside className="card">
        <p>
          <strong>{post.heartCount || 0} ❤️</strong>
        </p>

        <AuthCheck fallback={
          <Link href="/enter">

            <button>❤️ Sign Up</button>
          </Link>
        }>
          <HeartButton postRef={postRef}/>
        </AuthCheck>
      </aside>
    </main>
  );
};

export default Post;
