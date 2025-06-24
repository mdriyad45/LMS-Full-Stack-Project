import { thumbnailUploadService } from "@/ApiServices/apiAxiosInstanceService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InstructorContext } from "@/context/instructor-context/InstructorProvider";
import React, { useContext, useState } from "react";
import CourseCurriculum from "./CourseCurriculum ";
import MediaProgressBar from "@/components/MediaProgressBar/MediaProgressBar";

const CousrseSettings = () => {
  const [uploadPercent, setUploadpercent] = useState(0);
  const {
    courseLandingFormData,
    setCourseLandingFormData,
    mediaUploadProgess,
    setMediaUploadProgress,
    mediaUploadProgressPercentage,
    setMediaUploadProgressPercentage,
  } = useContext(InstructorContext);

  const handleThumbnailUpload = async (fileOrEvent) => {
    const selectedFile = fileOrEvent?.target?.files[0] || fileOrEvent;
    console.log(selectedFile);
    if (!selectedFile) return;

    try {
      setMediaUploadProgress(true);
      setUploadpercent(0);

      const ImageFormData = new FormData();
      ImageFormData.append("image", selectedFile);

      const response = await thumbnailUploadService(
        ImageFormData,
        (progress) => {
          const percent = Math.round((progress.loaded * 100) / progress.total);
          setMediaUploadProgressPercentage(percent);
        }
      );

      if (response.success) {
        const update = {
          ...courseLandingFormData,
          image: response.data.secure_url,
        };
        setCourseLandingFormData(update);
      }
    } catch (error) {
      console.warn(error.message);
    } finally {
      setMediaUploadProgress(false);
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
  console.log(courseLandingFormData);

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
            {
                mediaUploadProgess ? (
                    <MediaProgressBar 
                    isMediaUploading={mediaUploadProgess}
                    progressPercentence={mediaUploadProgressPercentage}/>
                ) : null
            }
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
                >
                  {mediaUploadProgressPercentage}%
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CousrseSettings;
