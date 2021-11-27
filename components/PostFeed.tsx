import Link from "next/link";

interface postFeedInterface {
  posts: any;
  admin?: boolean;
}
const PostFeed: React.FC<postFeedInterface> = ({ posts, admin }) => {
  return posts.map((post: any) => (
    <PostItem post={post} key={post.slug} admin={admin} />
  ));
};

const PostItem: React.FC<any> = ({ post, admin = false }) => {
  const wordCount = post?.content.trim().split("/s+/g").length;
  const minToRead = (wordCount / 100 + 1).toFixed(0);

  return (
    <div className="card">
      <Link href={`/${post.username}`}>
        <a>
          <strong>By @{post.username}</strong>
        </a>
      </Link>

      <Link href={`/${post.username}/${post.slug}`}>
        <h2>
          <a>{post.title}</a>
        </h2>
      </Link>

      <footer>
        <span>
          {wordCount} words • {minToRead} min read
        </span>
        <span>❤️ {post.heartCount} Hearts</span>
      </footer>
    </div>
  );
};

export default PostFeed;
