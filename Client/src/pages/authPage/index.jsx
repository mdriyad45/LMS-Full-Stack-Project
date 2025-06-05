import CommonForm from "@/components/common-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { signupFormControls } from "@/config";

import { GraduationCap } from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";

const AuthPage = () => {
  const [activeTab, setActiveTab] = useState("signin");
  const handleTabChange = (value) => {
    setActiveTab(value);
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
            <TabsTrigger value="signin">SignIn</TabsTrigger>
            <TabsTrigger value="signout">SignOut</TabsTrigger>
          </TabsList>
          <TabsContent value="signin">
            Make changes to your signin account here.
          </TabsContent>
          <TabsContent value="signout">
            <CommonForm
              formControls={signupFormControls}
              buttonText={"Sign Up"}
            ></CommonForm>
          </TabsContent>
        </Tabs>
      </div>
      
    </div>
  );
};

export default AuthPage;
