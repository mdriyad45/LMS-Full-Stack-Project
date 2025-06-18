import CourseCuriculumn from "@/components/instructor_view/Courses/AddNewCourse/CourseCurriculum ";
import CourseLanding from "@/components/instructor_view/Courses/AddNewCourse/CourseLanding";
import CousrseSettings from "@/components/instructor_view/Courses/AddNewCourse/CousrseSettings";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tabs } from "@radix-ui/react-tabs";
import React from "react";

const AddNewCoursePage = () => {
  return (
    <div className="container mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-extrabold mb-5">Create a new courses</h1>
        <Button className="text-sm tracking-wider font-bold px-8">
          SUBMIT
        </Button>
      </div>
      <Card className="bg-white shadow-md ">
        <CardContent>
          <div className="container mx-auto">
            <Tabs defaultValue="curricular" className="space-y-4">
              <TabsList className="gap-7">
                <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                <TabsTrigger value="course-landing-page">Course Landing Page</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              <TabsContent value="curriculum">
                <CourseCuriculumn/>
              </TabsContent>
              <TabsContent value="course-landing-page">
                <CourseLanding/>
              </TabsContent>
              <TabsContent value="settings">
                <CousrseSettings/>
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddNewCoursePage;
