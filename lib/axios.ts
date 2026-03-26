import axios from "axios";
import { authStorage } from "./authStorage";

const api = axios.create({
  baseURL: "http://192.168.0.107:5001/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to include the auth token
api.interceptors.request.use(
  async (config) => {
    const fullUrl = `${config.baseURL || ""}${config.url || ""}`;
    console.log(`[Axios Request] ${config.method?.toUpperCase()} ${fullUrl}`);

    if (config.data) {
      console.log("[Axios Payload]", JSON.stringify(config.data, null, 2));
    }

    const token = await authStorage.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("Axios Request Error:", error);
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => {
    console.log(
      `[Axios Response] ${response.status} from ${response.config.url}`,
    );
    return response;
  },
  (error) => {
    let message = "An unexpected error occurred.";
    const fullUrl = error.config?.url
      ? `${error.config.baseURL}${error.config.url}`
      : "unknown URL";

    // Suppress 404 logging for quiz session endpoints
    const isSessionEndpoint = fullUrl.includes("/quiz-sessions/");
    const is404 = error.response?.status === 404;

    if (!error.response) {
      // NETWORK ERROR
      message =
        "Cannot connect to the server. Make sure the backend is running and your phone is connected to the same WiFi network.";
      console.error(`[Axios Network Error] ${fullUrl}:`, error.message);
    } else {
      const { status, data } = error.response;

      if (!(isSessionEndpoint && is404)) {
        console.error(
          `[Axios Error Response] ${status} from ${fullUrl}:`,
          JSON.stringify(data, null, 2),
        );
      }

      if (status === 401) {
        message = "Invalid email or password.";
      } else if (status === 400) {
        message = data?.message || "Please check your input and try again.";
      } else if (status >= 500) {
        message = "Something went wrong on the server. Please try again later.";
      } else {
        message = data?.message || message;
      }
    }

    // Normalize error for React Query
    const normalizedError = {
      message,
      originalError: error,
      status: error.response?.status,
    };

    return Promise.reject(normalizedError);
  },
);

export default api;
