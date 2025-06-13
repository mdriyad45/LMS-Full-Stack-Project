import React from "react";
import FormControl from "./form-control";
import { Button } from "../ui/button";

const CommonForm = ({
  handleSubmit,
  buttonText,
  formControls = [],
  formData,
  setFormData,
  isButtonDisabled = false
}) => {

   
  return (
    <form onSubmit={handleSubmit}>
      {/**render form controls here */}
      <FormControl
        formControls={formControls}
        formData={formData}
        setFormData={setFormData}
      ></FormControl>
      <Button disabled={isButtonDisabled} type="submit" className='mt-5 w-full bg-black text-white'>{buttonText || "submit"}</Button>
    </form>
  );
};

export default CommonForm;
