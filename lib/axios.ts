import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { authStorage } from "./authStorage";

interface ApiRequestConfig extends InternalAxiosRequestConfig {
  skipErrorToast?: boolean;
}

const getErrorMessage = (error: AxiosError): string => {
  const data = error.response?.data as { message?: string } | undefined;

  if (data?.message) {
    return data.message;
  }

  if (!error.response) {
    return "Cannot connect to the server. Make sure the backend is running and your phone is connected to the same WiFi network.";
  }

  const status = error.response.status;
  if (status === 401) return "Please login to continue.";
  if (status === 403) return "You do not have permission to perform this action.";
  if (status === 404) return "The requested resource was not found.";
  if (status >= 500) {
    return "Something went wrong on our end. Please try again later.";
  }

  return "An unexpected error occurred.";
};

const api = axios.create({
  baseURL: "http://192.168.1.105:5001/api/",
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
  (error: AxiosError) => {
    const config = error.config as ApiRequestConfig | undefined;
    const fullUrl = error.config?.url
      ? `${error.config.baseURL}${error.config.url}`
      : "unknown URL";

    const isSessionEndpoint = fullUrl.includes("/quiz-sessions/");
    const is404 = error.response?.status === 404;
    const message = getErrorMessage(error);

    if (!error.response) {
      console.error(`[Axios Network Error] ${fullUrl}:`, error.message);
    } else if (!(isSessionEndpoint && is404)) {
      console.error(
        `[Axios Error Response] ${error.response.status} from ${fullUrl}:`,
        JSON.stringify(error.response.data, null, 2),
      );
    }

    const normalizedError = {
      message,
      code: (error.response?.data as { code?: string })?.code,
      originalError: error,
      status: error.response?.status,
    };

    return Promise.reject(normalizedError);
  },
);

export default api;
