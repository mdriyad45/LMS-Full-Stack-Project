import { mediaUploadService } from "@/ApiServices/apiAxiosInstanceService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { courseCurriculumInitialFormData } from "@/config";
import { InstructorContext } from "@/context/instructor-context/InstructorProvider";
import React, { useContext, useState } from "react";

const CourseCurriculum = () => {
  const [uploadProgress, setUploadProgress] = useState({});
  const {
    CourseCurriculumFormData,
    setCourseCurriculumFormData,
    mediaUploadProgess,
    setMediaUploadProgress,
  } = useContext(InstructorContext);

  const handleNewLecture = () => {
    setCourseCurriculumFormData([
      ...CourseCurriculumFormData,
      { ...courseCurriculumInitialFormData[0] },
    ]);
  };

  const handleCourseTitleChange = (event, index) => {
    const updated = [...CourseCurriculumFormData];
    updated[index] = { ...updated[index], title: event.target.value };
    setCourseCurriculumFormData(updated);
  };

  const handleFreePreviewChange = (value, index) => {
    const updated = [...CourseCurriculumFormData];
    updated[index] = { ...updated[index], freePreview: value };
    setCourseCurriculumFormData(updated);
  };

  const handleSingleLectureUpload = async (fileOrEvent, index) => {
    const selectedFile = fileOrEvent?.target?.files?.[0] || fileOrEvent;
    if (!selectedFile) return;

    const videoFormData = new FormData();
    videoFormData.append("video", selectedFile);

    try {
      setMediaUploadProgress(true);
      setUploadProgress((prev) => ({ ...prev, [index]: 0 }));

      const response = await mediaUploadService(videoFormData, (progressEvent) => {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setUploadProgress((prev) => ({ ...prev, [index]: percent }));
      });

      if (response?.success) {
        const updated = [...CourseCurriculumFormData];
        updated[index] = {
          ...updated[index],
          videoUrl: response.data.secure_url,
          public_id: response.data.public_id,
        };
        setCourseCurriculumFormData(updated);
      }
    } catch (error) {
      console.error("Upload failed:", error.message);
    } finally {
      setMediaUploadProgress(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleSingleLectureUpload(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Create Course Curriculum</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={handleNewLecture} className="bg-black text-white mb-4">
            Add Lecture
          </Button>
          <div onDrop={handleDrop} onDragOver={handleDragOver}>
            {CourseCurriculumFormData.map((item, index) => (
              <div key={index} className="border p-5 rounded-md mb-3 mt-4">
                <div className="flex gap-5 items-center">
                  <h3>Lecture {index + 1}</h3>
                  <Input
                    name={`title-${index}`}
                    placeholder="Enter lecture title"
                    className="max-w-96"
                    value={item.title}
                    onChange={(e) => handleCourseTitleChange(e, index)}
                  />
                  <div className="flex items-center gap-3">
                    <Switch
                      id={`freePreview-${index}`}
                      checked={item.freePreview}
                      onCheckedChange={(value) => handleFreePreviewChange(value, index)}
                    />
                    <Label htmlFor={`freePreview-${index}`}>Free Preview</Label>
                  </div>
                </div>

                <div className="mt-6">
                  <Input
                    type="file"
                    accept="video/*"
                    disabled={uploadProgress[index] > 0 && uploadProgress[index] < 100}
                    onChange={(e) => handleSingleLectureUpload(e, index)}
                    className="mb-4"
                  />

                  {uploadProgress[index] > 0 && (
                    <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden mt-2">
                      <div
                        className="bg-blue-600 h-full text-center text-white text-sm transition-all duration-300"
                        style={{ width: `${uploadProgress[index]}%` }}
                      >
                        {uploadProgress[index]}%
                      </div>
                    </div>
                  )}

                  {item.videoUrl && (
                    <video
                      src={item.videoUrl}
                      controls
                      className="mt-4 w-full max-w-md rounded shadow-md"
                    />
                  )}
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
