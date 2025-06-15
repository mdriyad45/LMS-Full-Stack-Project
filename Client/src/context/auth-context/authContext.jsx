import { initialSignInFormData, initialSignUPFormData } from "@/config";
import Cookies from "js-cookie";
import {
  checkAuth,
  loginService,
  logoutService,
  registerService,
} from "@/ApiServices/apiAxiosInstanceService";
import { createContext, useEffect, useState } from "react";

export const authContext = createContext();

export default function AuthProvider({ children }) {
  const [signInFormData, setSignInFormData] = useState(initialSignInFormData);
  const [signUpFormData, setSignUpFormData] = useState(initialSignUPFormData);
  const [auth, setAuth] = useState({
    authenticate: false,
    user: null,
  });

  const handleRegisterUser = async (event) => {
    event.preventDefault();
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

      if (data.success) {
        setAuth({
          authenticate: true,
          user: data.data.loggedInUser,
        });
      } else {
        setAuth({
          authenticate: false,
          user: null,
        });
      }
    } catch (error) {
      console.error("Login failed:", error.message || error);
    }
  };

  const handleLogOutUser = async () => {
    try {
      const { data } = await logoutService();

      if (data.success) {
        setAuth({
          authenticate: false,
          user: null,
        });
      }
    } catch (error) {
      console.error("Logout failed:", error.message || error);
    }
  };

  const checkAuthentication = async () => {
    try {
      const data = await checkAuth();
      if (data.success) {
        setAuth({
          authenticate: true,
          user: data.data,
        });
      } else {
        setAuth({
          authenticate: false,
          user: null,
        });
      }
    } catch (error) {
      console.error("User not authenticated:", error.message || error);
    }
  };

  useEffect(() => {
    checkAuthentication();
  }, []);

  return (
    <authContext.Provider
      value={{
        signInFormData,
        setSignInFormData,
        signUpFormData,
        setSignUpFormData,
        handleRegisterUser,
        handleLoginUser,
        handleLogOutUser,
        checkAuthentication,
        auth,
      }}
    >
      {children}
    </authContext.Provider>
  );
}
