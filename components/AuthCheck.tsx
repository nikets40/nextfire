import Link from "next/link";
import { useContext } from "react";
import { UserContext } from "../lib/context";

export const AuthCheck: React.FC<any> = (props) => {
  const userData = useContext(UserContext);
  return userData?.username
    ? props.children
    : props.fallback || <Link href="/enter">You must be signed in</Link>;
};
