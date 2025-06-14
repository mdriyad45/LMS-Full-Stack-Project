import { initialSignInFormData, initialSignUPFormData } from "@/config";
import { loginService, registerService } from "@/services/AxiosInstanceService";
import { createContext, useState } from "react";

export const authContext = createContext();

export default function AuthProvider({ children }) {
  const [signInFormData, setSignInFormData] = useState(initialSignInFormData);
  const [signUpFormData, setSignUpFormData] = useState(initialSignUPFormData);

  const handleRegisterUser = async (event) => {
    try {
      const data = await registerService(signUpFormData);
      console.log("Registration success:", data);
    } catch (err) {
      console.error("Registration failed:", err.message || err);
    }
  };

  const handleLoginUser = async (event) => {
    event.preventDefault();
    try {
      const data = await loginService(signInFormData);
      console.log("Login success:", data);
    } catch (err) {
      console.error("Login failed:", err.message || err);
    }
  };

  return (
    <authContext.Provider
      value={{
        signInFormData,
        setSignInFormData,
        signUpFormData,
        setSignUpFormData,
        handleRegisterUser,
        handleLoginUser,
      }}
    >
      {children}
    </authContext.Provider>
  );
}
