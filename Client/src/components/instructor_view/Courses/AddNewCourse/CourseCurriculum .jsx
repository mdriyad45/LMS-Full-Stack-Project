import {
  mediaUploadService,
  removeVideoService,
} from "@/ApiServices/apiAxiosInstanceService";
import MediaProgressBar from "@/components/MediaProgressBar/MediaProgressBar";
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
  const [uploadingStates, setUploadingStates] = useState({});
  const [uploading, setUploading] = useState(false);

  const { CourseCurriculumFormData, setCourseCurriculumFormData } =
    useContext(InstructorContext);

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
      setUploadingStates((prev) => ({ ...prev, [index]: true }));
      setUploadProgress((prev) => ({ ...prev, [index]: 0 }));
      setUploading(true);

      const response = await mediaUploadService(
        videoFormData,
        (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress((prev) => ({ ...prev, [index]: percent }));
        }
      );

      if (response?.success) {
        const updated = [...CourseCurriculumFormData];
        updated[index] = {
          ...updated[index],
          videoUrl: response.data.secure_url,
          public_id: response.data.public_id,
          _id: response.data._id,
        };
        setCourseCurriculumFormData(updated);
      }
    } catch (error) {
      console.error("Upload failed:", error.message);
    } finally {
      setUploading(false);
      setTimeout(() => {
        setUploadingStates((prev) => ({ ...prev, [index]: false }));
      }, 1000);
    }
  };

  const handleDrop = (e, index) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleSingleLectureUpload(file, index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const isCourseFormDataValid = () => {
    return CourseCurriculumFormData.every((item) => {
      return (
        item &&
        typeof item === "object" &&
        item.title.trim() === "" &&
        item.videoUrl.trim() === ""
      );
    });
  };

  const handleReplaceVideo = async (currentIndex) => {
    const input = document.createElement("input");
    (input.type = "file"),
      (input.accept = "video/*"),
      (input.onchange = (event) =>
        handleSingleLectureUpload(event, currentIndex));
    input.click();

    let copyCourseCurriculumFormData = [...CourseCurriculumFormData];
    const _id = copyCourseCurriculumFormData[currentIndex]._id;

    const responseData = await removeVideoService(_id);
    console.log(responseData);
    if (responseData.success) {
      const updated = [...CourseCurriculumFormData];
      updated[currentIndex] = {
        ...updated[currentIndex],
        videoUrl: "",
        public_id: "",
        _id: "",
      };
      setCourseCurriculumFormData(updated);
    }
  };
  const handleDeleteVideo = async (currentIndex) => {
    let copyCourseCurriculumFormData = [...CourseCurriculumFormData];
    const _id = copyCourseCurriculumFormData[currentIndex]._id;

    const responseData = await removeVideoService(_id);
    if (responseData.success) {
      const updated = [...CourseCurriculumFormData];
      updated[currentIndex] = {
        ...updated[currentIndex],
        videoUrl: "",
        public_id: "",
        _id: "",
      };
      setCourseCurriculumFormData(updated);
    }
  };

  return (
    <div className="max-w-9xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Create Course Curriculum</CardTitle>
        </CardHeader>
        <CardContent>
          <Button
            onClick={handleNewLecture}
            disabled={!isCourseFormDataValid || uploading}
            className="bg-black text-white mb-4 hover:bg-gray-800"
          >
            Add Lecture
          </Button>
          <div>
            {CourseCurriculumFormData.map((item, index) => (
              <div
                onDrop={(e) => handleDrop(e, index)}
                onDragOver={handleDragOver}
                key={index}
                className="border p-5 rounded-md mb-3 mt-4 bg-gray-50"
              >
                <div className="flex gap-5 items-center flex-wrap">
                  <h3 className="font-semibold">Lecture {index + 1}</h3>
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
                      onCheckedChange={(value) =>
                        handleFreePreviewChange(value, index)
                      }
                    />
                    <Label htmlFor={`freePreview-${index}`}>Free Preview</Label>
                  </div>
                </div>

                <div className="mt-6">
                  {item.videoUrl ? (
                    <div className="flex gap-3">
                      <video
                        src={item.videoUrl}
                        controls
                        className="mt-4 w-max-7xl h-96 max-w-md rounded shadow-md"
                      />
                      <Button
                        className="bg-green-700 text-gray-50"
                        onClick={() => handleReplaceVideo(index)}
                      >
                        Replace Video
                      </Button>
                      <Button
                        className="bg-red-800 text-gray-50"
                        onClick={() => {
                          handleDeleteVideo(index);
                        }}
                      >
                        Delete Lecture
                      </Button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <div className="flex justify-center mb-4">
                        <div className="w-12 h-12 border-2 border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                          <svg
                            className="w-6 h-6 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="relative inline-block">
                          <Input
                            type="file"
                            accept="video/*"
                            disabled={uploadingStates[index]}
                            onChange={(e) =>
                              handleSingleLectureUpload(e, index)
                            }
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                          <button
                            className="px-4 py-2 border w-4xl border-gray-300 rounded bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                            disabled={uploadingStates[index]}
                          >
                            Choose file
                          </button>
                        </div>

                        <div className="space-y-1">
                          <p className="text-gray-600">
                            Or drag and drop a video file here
                          </p>
                          <p className="text-sm text-gray-400">
                            Supported: MP4, AVI, MOV, WebM (Max 100MB)
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <MediaProgressBar
                    isMediaUploading={uploadingStates[index]}
                    progressPercentence={uploadProgress[index] || 0}
                  />
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
