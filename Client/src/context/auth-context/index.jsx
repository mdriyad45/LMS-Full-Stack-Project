import { initialSignInFormData, initialSignUPFormData } from "@/config";
import { loginService, registerService } from "@/services";
import { createContext, useState } from "react";

export const authContext = createContext();

export default function AuthPorvider({ children }) {
  const [signInFormData, setSignInFormData] = useState(initialSignInFormData);
  const [signUpFormData, setSignUpFormData] = useState(initialSignUPFormData);

  const handleRegisterService = async (event) => {
    event.preventDefault();
    const data = await registerService(signUpFormData);
  };

  const handleLoginService = async (event) => {
    event.preventDefault();
    const data = await loginService(signInFormData);
  };

  return (
    <authContext.Provider
      value={{
        signInFormData,
        setSignInFormData,
        signUpFormData,
        setSignUpFormData,
        handleRegisterService,
        handleLoginService,
      }}
    >
      {children}
    </authContext.Provider>
  );
}
