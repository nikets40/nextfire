import Link from "next/link";
import Image from "next/image";
import { useContext } from "react";
import { UserContext } from "../lib/context";

interface User {
  photoURL: string;
}
const Navbar: React.FC = () => {
 const userData = useContext(UserContext);

  return (
    <nav className="navbar">
      <ul>
        <li>
          <Link passHref href="/">
            <button className="btn-logo">NXT</button>
          </Link>
        </li>

        {(userData?.username) && (
          <>
            <li className="push-left">
              <Link passHref href="/admin">
                <button className="btn-blue">Write Post</button>
              </Link>
            </li>

            <li>
              <Link passHref href={`/${userData.username}`}>
                <img
                  className="avatar"
                  src={userData?.user?.photoURL??""}
                  alt=""
                />
              </Link>
            </li>
          </>
        )}

        {!userData?.username && (
          <li>
            <Link passHref href="/enter">
              <button className="btn-blue">Log in</button>
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
