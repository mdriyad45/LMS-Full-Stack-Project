import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { courseCurriculumInitialFormData } from "@/config";
import { InstructorContext } from "@/context/instructor-context/InstructorProvider";
import React, { useContext } from "react";

const CourseCurriculum = () => {
  const { CourseCurriculumFormData, setCourseCurriculumFormData } =
    useContext(InstructorContext);

    const handleNewLecture = ()=>{
        setCourseCurriculumFormData([
            ...CourseCurriculumFormData,
            {
                ...courseCurriculumInitialFormData[0]
            }
        ])
    }
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Create Course Curriculum</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={handleNewLecture} className="bg-black text-white">Add Lecture</Button>
          <div>
            {CourseCurriculumFormData.map((curriculumItem, index) => (
              <div className="border p-5 rounded-md mb-3 mt-4">
                <div className="flex gap-5 items-center">
                  <h3>Lecture {`${index + 1}`}</h3>
                  <Input
                    name={`title-${index + 1}`}
                    placeholder="Enter lecture title"
                    className="max-w-96"
                  />
                  <div className="flex items-center gap-3">
                    <Switch checked={true} id={`freePreview-${index + 1}`} />
                    <Label htmlFor={`freePreview-${index + 1}`}>
                      Free Preview
                    </Label>
                  </div>
                </div>
                <div className="mt-6">
                  <Input type="file" accept="video/*" className="mb-4" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CourseCurriculum;
