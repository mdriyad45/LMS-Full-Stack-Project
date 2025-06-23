import { thumbnailUploadService } from "@/ApiServices/apiAxiosInstanceService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InstructorContext } from "@/context/instructor-context/InstructorProvider";
import React, { useContext, useState } from "react";

const CousrseSettings = () => {
  const [uploadPercent, setUploadpercent] = useState(0);
  const {
    courseLandingFormData,
    setCourseLandingFormData,
    mediaUploadProgess,
    setMediaUploadProgress,
  } = useContext(InstructorContext);

  const handleThumbnailUpload = async (fileOrEvent) => {
    const selectedImage = fileOrEvent?.target?.files?.[0] || fileOrEvent;
    console.log(selectedImage);

    if (selectedImage) {
      const imageFormData = new FormData();
      imageFormData.append("image", selectedImage);

      try {
        setMediaUploadProgress(true);
        setUploadpercent(0);

        const response = await thumbnailUploadService(
          imageFormData,
          (progressEvent) => {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadpercent(percent);
          }
        );

        if (response.success) {
          setCourseLandingFormData({
            ...courseLandingFormData,
            image: response.data.secure_url,
          });
        }
      } catch (error) {
        console.warn("Image upload failed:", error.message);
      } finally {
        setMediaUploadProgress(false);
      }
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const dropFile = event.dataTransfer.files[0];
    if (dropFile) {
      handleThumbnailUpload(dropFile);
    }
  };
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div onDrop={handleDrop} onDragOver={handleDragOver}>
      <Card>
        <CardHeader>
          <CardTitle>Course Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label>Upload Course Image</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={(event) => {
                handleThumbnailUpload(event);
              }}
            />
            {courseLandingFormData.image && (
              <img
                src={courseLandingFormData.image}
                alt="Preview"
                className="w-full max-w-xs mt-4 rounded-md shadow-md"
              />
            )}

            {mediaUploadProgess && (
              <div className="mt-4 w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                <div
                  className="bg-blue-600 h-full transition-all duration-300"
                  style={{ width: `${uploadPercent}%` }}
                >{uploadPercent}%</div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CousrseSettings;
