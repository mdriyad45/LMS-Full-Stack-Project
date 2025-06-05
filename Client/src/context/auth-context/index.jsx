import { createContext } from "react";

export const authContext = createContext();

export default function AuthPorvider ({children}){
    return <authContext.Provider value={{}}>{children}</authContext.Provider>
}