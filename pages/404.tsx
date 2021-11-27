import { NextPage } from "next";
import Link from "next/link";

export const Custom404: NextPage = () => {
  return (
    <main className="">
      <h1>404 - This page does not seem to exist...</h1>
      <iframe
        src="https://giphy.com/embed/l2JehQ2GitHGdVG9y"
        width="480"
        height="362"
        frameBorder="0"
        allowFullScreen
      ></iframe>
      <Link href="/" passHref>
        <button className="btn-blue">Go home</button>
      </Link>
    </main>
  );
};

export default Custom404;
