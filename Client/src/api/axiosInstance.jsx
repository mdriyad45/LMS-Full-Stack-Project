import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:6000",
});

export default axiosInstance;