import { thumbnailUploadService } from "@/ApiServices/apiAxiosInstanceService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InstructorContext } from "@/context/instructor-context/InstructorProvider";
import React, { useContext, } from "react";
import CourseCurriculum from "./CourseCurriculum ";
import MediaProgressBar from "@/components/MediaProgressBar/MediaProgressBar";
import { Button } from "@/components/ui/button";

const CousrseSettings = () => {


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
            <Label>Course Thumbnail Image</Label>

            {courseLandingFormData?.image ? (
              <div className="flex gap-3">
                <img
                  src={courseLandingFormData.image || "/placeholder.svg"}
                  alt="Preview"
                  className="w-full max-w-xs mt-4 rounded-md shadow-md"
                />
                <Button className="bg-green-700 text-gray-50">Replace Video</Button>
                <Button className="bg-red-800 text-gray-50">Delete Lecture</Button>
              </div>
            ) : (
              <div className="mt-4 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                {/* Image Icon */}
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 border-2 border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  </div>
                </div>

                {/* File Input */}
                <div className="space-y-4">
                  <div className="relative inline-block">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(event) => {
                        handleThumbnailUpload(event)
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <button className="px-4 py-2 border border-gray-300 rounded bg-white text-gray-700 hover:bg-gray-50">
                      Choose file
                    </button>
                    <span className="ml-3 text-gray-500">No file chosen</span>
                  </div>

                  {/* Drag and Drop Text */}
                  <div className="space-y-1">
                    <p className="text-gray-600">Or drag and drop an image file here</p>
                    <p className="text-sm text-gray-400">Supported: JPEG, PNG, GIF, WebP (Max 5MB)</p>
                  </div>
                </div>
              </div>
            )}

            {mediaUploadProgess ? (
              <MediaProgressBar
                isMediaUploading={mediaUploadProgess}
                progressPercentence={mediaUploadProgressPercentage}
              />
            ) : null}
          </div>
        </CardContent>
      </Card>
    </div>
  
  );
};

export default CousrseSettings;
