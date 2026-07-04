import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

declare module "axios" {
  export interface AxiosRequestConfig {
    skipGlobalErrorLog?: boolean;
  }
}

interface ApiClient extends AxiosInstance {
  get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T>;
  post<T = unknown, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig,
  ): Promise<T>;
  put<T = unknown, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig,
  ): Promise<T>;
  delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T>;
}

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
}) as ApiClient;

apiClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (!error.config?.skipGlobalErrorLog) {
      if (error.response) {
        console.error("API Error:", error.response.data);
      } else {
        console.error("Network Error:", error.message);
      }
    }
    return Promise.reject(error);
  },
);

export default apiClient;
