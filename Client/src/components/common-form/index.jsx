import React from "react";
import FormControl from "./form-control";
import { Button } from "../ui/button";

const CommonForm = ({
  handleSubmit,
  buttonText,
  formControls = [],
  formData,
  setFormData,
}) => {

   
  return (
    <form onSubmit={handleSubmit}>
      {/**render form controls here */}
      <FormControl
        formControls={formControls}
        formData={formData}
        setFormData={setFormData}
      ></FormControl>
      <Button type="submit">{buttonText || "submit"}</Button>
    </form>
  );
};

export default CommonForm;
