import axios, {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import {
  AuthResponse,
  RefreshTokenResponse,
  RegisterUserData,
  ResetPasswordData,
  CustomRequestConfig,
  VerifyOtpCodeData,
} from "@/types/user.type";
const API_URL =
  import.meta.env.VITE_API_PRODUCTION_URL || "https://your-api-url.com/api";
const MEDIA_API_URL =
  import.meta.env.VITE_MEDIA_API_URL || "https://your-media-api-url.com";

const authAxios: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const apiAxios: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const mediaAxios: AxiosInstance = axios.create({
  baseURL: MEDIA_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const AUTH_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";

const getAuthToken = (): string | null => localStorage.getItem(AUTH_TOKEN_KEY);
const getRefreshToken = (): string | null =>
  localStorage.getItem(REFRESH_TOKEN_KEY);

const saveTokens = (authToken: string, refreshToken: string): void => {
  localStorage.setItem(AUTH_TOKEN_KEY, authToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
};

const clearAuth = (): void => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

apiAxios.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

mediaAxios.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }
);

const emitTokenExpiredEvent = () => {
  window.dispatchEvent(new Event("auth:tokenExpired"));
};

apiAxios.interceptors.response.use(
  (response): AxiosResponse => response,
  async (error) => {
    const originalRequest = error.config as CustomRequestConfig;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = getRefreshToken();
        if (!refreshToken) {
          clearAuth();
          emitTokenExpiredEvent();
          return Promise.reject(error);
        }

        const response = await refreshAccessToken(refreshToken);

        const { message, result } = response.data;
        console.log("Token refreshed successfully", message, response.data);
        saveTokens(result.access_token, result.refresh_token);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${result.access_token}`;
        }
        return apiAxios(originalRequest);
      } catch (refreshError) {
        clearAuth();
        emitTokenExpiredEvent();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

mediaAxios.interceptors.response.use(
  (response): AxiosResponse => response,
  async (error) => {
    const originalRequest = error.config as CustomRequestConfig;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = getRefreshToken();
        if (!refreshToken) {
          clearAuth();
          emitTokenExpiredEvent();
          return Promise.reject(error);
        }

        const response = await refreshAccessToken(refreshToken);

        const { message, result } = response.data;
        console.log("Token refreshed successfully", message, response.data);
        saveTokens(result.access_token, result.refresh_token);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${result.access_token}`;
        }
        return mediaAxios(originalRequest);
      } catch (refreshError) {
        clearAuth();
        emitTokenExpiredEvent();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

const login = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  try {
    const response = await authAxios.post<AuthResponse>("/users/login", {
      email_or_username: email,
      password,
    });
    const { message, result } = response.data;

    console.log("Login successful", message, response.data);

    saveTokens(result.access_token, result.refresh_token);

    return response.data;
  } catch (error) {
    throw error;
  }
};

const register = async (userData: RegisterUserData): Promise<AxiosResponse> => {
  try {
    const response = await authAxios.post("/users/register", userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const logout = async (): Promise<void> => {
  try {
    const refreshToken = getRefreshToken();
    if (refreshToken) {
      await authAxios.post("/users/logout", { refreshToken });
    }
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    clearAuth();
  }
};

const refreshAccessToken = async (
  refresh_token: string
): Promise<AxiosResponse<RefreshTokenResponse>> => {
  return authAxios.post<RefreshTokenResponse>("/users/refresh-token", {
    refresh_token,
  });
};

const forgotPassword = async (email: string): Promise<AxiosResponse> => {
  return authAxios.post("/users/forgot-password", { email });
};

const resetPassword = async ({
  forgot_password_token,
  password,
  confirm_password,
}: ResetPasswordData): Promise<AxiosResponse> => {
  return authAxios.post("/users/reset-password", {
    forgot_password_token,
    password,
    confirm_password,
  });
};

const verifyOtpCode = async ({
  email,
  otp_code,
}: VerifyOtpCodeData): Promise<AxiosResponse> => {
  return authAxios.post("/users/verify-otp-code", {
    email,
    otp_code,
  });
};

const resendVerifyEmail = async (email: string): Promise<AxiosResponse> => {
  return authAxios.post("/users/resend-verify-email", { email });
};

const verifyEmail = async (
  email_verify_token: string
): Promise<AxiosResponse> => {
  return authAxios.post("/users/verify-email", { email_verify_token });
};

const changePassword = async ({
  old_password,
  new_password,
  confirm_password,
}: {
  old_password: string;
  new_password: string;
  confirm_password: string;
}): Promise<AxiosResponse> => {
  return authAxios.put("/users/change-password", {
    old_password,
    new_password,
    confirm_password,
  });
};

const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

const authService = {
  login,
  register,
  logout,
  forgotPassword,
  resetPassword,
  changePassword,
  verifyOtpCode,
  resendVerifyEmail,
  verifyEmail,
  isAuthenticated,
  getAuthToken,
  getRefreshToken,
  emitTokenExpiredEvent,
};

export default authService;
export { apiAxios, mediaAxios };
