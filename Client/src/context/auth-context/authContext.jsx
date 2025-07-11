import { initialSignInFormData, initialSignUPFormData } from "@/config";
import Cookies from "js-cookie";
import {
  checkAuth,
  loginService,
  logoutService,
  registerService,
} from "@/ApiServices/apiAxiosInstanceService";
import { createContext, useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const authContext = createContext();

export default function AuthProvider({ children }) {
  const [signInFormData, setSignInFormData] = useState(initialSignInFormData);
  const [signUpFormData, setSignUpFormData] = useState(initialSignUPFormData);
  const [auth, setAuth] = useState({
    authenticate: false,
    user: null,
  });
  const [loading, setLoading] = useState(false);

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
      setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const handleLogOutUser = async () => {
    try {
      setLoading(true);
      const data = await logoutService();
      console.log(data);

      if (data.success) {
        setAuth({
          authenticate: false,
          user: null,
        });
      }
    } catch (error) {
      console.error("Logout failed:", error.message || error);
    } finally {
      setLoading(false);
    }
  };

  const checkAuthentication = async () => {
    try {
      setLoading(true);
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
      if (!error?.response?.data?.success) {
        setAuth({
          authenticate: false,
          user: null,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuthentication();
  }, []);
  console.log(auth);

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
        auth,
        loading,
      }}
    >
      {loading ? <Skeleton/> : children}
    </authContext.Provider>
  );
}
