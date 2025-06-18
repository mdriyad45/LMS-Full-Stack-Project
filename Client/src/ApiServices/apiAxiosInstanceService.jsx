import axiosInstance from "@/api/axiosInstance";

export const registerService = async (formData) => {
  try {
    const { data } = await axiosInstance.post("/api/v1/user/register", {
      ...formData,
      role: "user",
    });
    console.log(data);
    return data;
  } catch (error) {
    console.error("Register Error:", error?.response?.data || error.message);
    throw error?.response?.data || { message: "Registration failed" };
  }
};

export const loginService = async (formData) => {
  try {
    const { data } = await axiosInstance.post("/api/v1/user/login", {
      ...formData,
    });
    return data;
  } catch (error) {
    console.error("Login Error:", error?.response?.data || error.message);
    throw error?.response?.data || { message: "Login failed" };
  }
};

export const logoutService = async () => {
  try {
    const { data } = await axiosInstance.get("/api/v1/user/logout");
    console.log(data);
    return data;
  } catch (error) {
    console.error("Logout Error:", error?.response?.data || error.message);
    throw error?.response?.data || { message: "Logout failed" };
  }
};

export const checkAuth = async () => {
  try {
    const { data } = await axiosInstance.get("/api/v1/user/check-auth");
    return data;
  } catch (error) {
    console.error("Check Auth Error:", error.message);
    throw error?.response?.data || { message: "Check Auth failed" };
  }
};
