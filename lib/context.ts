import { createContext } from "react";
interface UserContextInterface{
    user: any,
    username: string | null,
}

export const UserContext = createContext<UserContextInterface | null>(null);
