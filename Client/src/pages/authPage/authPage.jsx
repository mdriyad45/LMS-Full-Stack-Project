import CommonForm from "@/components/common-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { signinFormControls, signupFormControls } from "@/config";
import { authContext } from "@/context/auth-context/authContext";
import { GraduationCap } from "lucide-react";
import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";

const AuthPage = () => {
  const [activeTab, setActiveTab] = useState("signin");
  const {
    signInFormData,
    setSignInFormData,
    signUpFormData,
    setSignUpFormData,
    handleRegisterUser,
    handleLoginUser
  } = useContext(authContext);
  const handleTabChange = (value) => {
    setActiveTab(value);
  };

  const isEmailValid = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isPasswordValid = (password) => {
    return password.length >= 6;
  };

  const cehckIfSignInFormIsValid = () => {
    const { userEmail, password } = signInFormData;

    if (!userEmail?.trim() || !password?.trim()) return false;

    if (!isEmailValid(userEmail)) return false;
    if (!isPasswordValid(password)) return false;

    return true;
  };
  const cehckIfSignUpFormIsValid = () => {
    const { userName, userEmail, password } = signUpFormData;

    if (!userName?.trim() || !userEmail?.trim() || !password?.trim())
      return false;

    if (!isEmailValid(userEmail)) return false;
    if (!isPasswordValid(password)) return false;

    return true;
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center border bg-amber-200">
        <Link to={"/"} className="flex items-center justify-center">
          <GraduationCap className="h-8 w-8 mr-4"></GraduationCap>
          <span className=" uppercase font-extrabold text-xl">LMS Learn</span>
        </Link>
      </header>
      <div className="flex items-center justify-center min-h-screen ">
        <Tabs
          value={activeTab}
          defaultValue="account"
          onValueChange={handleTabChange}
          className="w-full max-w-md"
        >
          <TabsList>
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signout">Sign Up</TabsTrigger>
          </TabsList>
          <TabsContent value="signin">
            <Card className="p-4 space-y-10 border-1 shadow-xl">
              <CardHeader>
                <CardTitle>Sign in to your account</CardTitle>
                <CardDescription>
                  Enter your email and password to access your account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CommonForm
                  formControls={signinFormControls}
                  formData={signInFormData}
                  setFormData={setSignInFormData}
                  buttonText={"Sign In"}
                  isButtonDisabled={!cehckIfSignInFormIsValid()}
                  handleSubmit={handleLoginUser}
                ></CommonForm>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="signout">
            <Card className="p-4 space-y-10 border-1 shadow-xl">
              <CardHeader>
                <CardTitle>Create a new account</CardTitle>
                <CardDescription>
                  Enter your username, email and password to create your account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CommonForm
                  formControls={signupFormControls}
                  formData={signUpFormData}
                  setFormData={setSignUpFormData}
                  isButtonDisabled={!cehckIfSignUpFormIsValid()}
                  buttonText={"Sign UP"}
                  handleSubmit={handleRegisterUser}
                ></CommonForm>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AuthPage;
