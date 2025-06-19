import { courseCurriculumInitialFormData, courseLandingInitialFormData } from "@/config";
import { createContext, useState } from "react";

export const InstructorContext = createContext(null);

const InstructorProvider = ({ children }) => {
  const [courseLandingFormData, setCourseLandingFormData] = useState(
    courseLandingInitialFormData
  );
  const [CourseCurriculumFormData, setCourseCurriculumFormData] = useState(courseCurriculumInitialFormData)
  return (
    <InstructorContext.Provider
      value={{ courseLandingFormData, setCourseLandingFormData, CourseCurriculumFormData, setCourseCurriculumFormData }}
    >
      {children}
    </InstructorContext.Provider>
  );
};

export default InstructorProvider;
