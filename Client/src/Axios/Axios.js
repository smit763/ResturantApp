import axios from "axios";
import { url } from "../common";

const axiosClient = axios.create({
  baseURL: `${url}/api/v1`,
});

axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.token = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosClient;
