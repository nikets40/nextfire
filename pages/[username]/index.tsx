import { NextPage, GetServerSideProps } from "next";
import PostFeed from "../../components/PostFeed";
import UserProfile from "../../components/UserProfile";
import {
  getUserWithUsername,
  db,
  postToJSON,
} from "../../lib/firebase";
import {
  collection,
  query,
  where,
  limit,
  orderBy,
  getDocs,
} from "firebase/firestore";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { username } = context?.query;
  const userDoc = await getUserWithUsername(username as string);

  if (!userDoc) {
    return {
      notFound: true,
    };
  }
  // Json serializable data
  let user = null;
  let posts = null;

  if (userDoc) {
    user = userDoc.data();

    const postQuery = query(
      collection(db, `${userDoc.ref.path}/posts`),
      where("published", "==", "true"),
      orderBy("createdAt", "desc"),
      limit(5)
    );

    const allPosts = await getDocs(postQuery);
    posts = allPosts.docs.map((doc) => postToJSON(doc));
  }

  return {
    props: {
      user,
      posts,
    },
  };
};

const UserProfilePage: NextPage<any> = ({ user, posts }) => {
  return (
    <main>
      <UserProfile user={user} />
      <PostFeed posts={posts} />
    </main>
  );
};

export default UserProfilePage;
