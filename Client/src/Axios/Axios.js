import axios from "axios";

const axiosClient = axios.create({
  baseURL: `${process.env.REACT_APP_URI}/api/v1`,
});
export default axiosClient;
