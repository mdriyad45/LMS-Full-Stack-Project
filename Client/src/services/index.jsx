import axiosInstance from "@/api/axiosInstance";

export const registerService = async (formData) => {
  const { data } = await axiosInstance.post("/api/v1/user/register", {
    ...formData,
    role: "user",
  });
  return data;
};

export const loginService = async (formData) => {
  const { data } = await axiosInstance.post("/api/v1/user/register", formData);
  return data;
};
