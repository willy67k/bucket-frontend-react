import axios from "axios";
const BACKEND_URL = "http://localhost:4000";

export const api = axios.create({
  baseURL: `${BACKEND_URL}/api`,
  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    return config;
  },
  (err) => Promise.reject(err),
);

api.interceptors.response.use(
  (response) => response,
  (err) => {
    return err.response;
  },
);
