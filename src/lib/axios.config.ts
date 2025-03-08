import axios from "axios";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
const apiUrl: string = baseUrl || "http://localhost:3000/api";

const axiosInstance = axios.create({
  baseURL: apiUrl,
});

export default axiosInstance;
