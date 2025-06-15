import axios from "axios";
import Cookies from "js-cookie";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true,

  headers: {
    "Content-Type": "application/json",
  },
});


export default axiosInstance;
