import { initialSignInFormData, initialSignUPFormData } from "@/config";
import { createContext, useState } from "react";

export const authContext = createContext();

export default function AuthPorvider({ children }) {
  const [signInFormData, setSignInFormData] = useState(initialSignInFormData);
  const [signUpFormData, setSignUpFormData] = useState(initialSignUPFormData);

  return (
    <authContext.Provider
      value={{
        signInFormData,
        setSignInFormData,
        signUpFormData,
        setSignUpFormData,
      }}
    >
      {children}
    </authContext.Provider>
  );
}
