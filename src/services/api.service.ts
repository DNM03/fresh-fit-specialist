import { apiAxios } from "./auth.service";
import { AxiosResponse } from "axios";

class ApiService {
  get<T = any>(
    endpoint: string,
    params: Record<string, any> = {}
  ): Promise<AxiosResponse<T>> {
    return apiAxios.get<T>(endpoint, { params });
  }

  post<T = any>(endpoint: string, data: any = {}): Promise<AxiosResponse<T>> {
    return apiAxios.post<T>(endpoint, data);
  }

  put<T = any>(endpoint: string, data: any = {}): Promise<AxiosResponse<T>> {
    return apiAxios.put<T>(endpoint, data);
  }

  patch<T = any>(endpoint: string, data: any = {}): Promise<AxiosResponse<T>> {
    return apiAxios.patch<T>(endpoint, data);
  }

  delete<T = any>(
    endpoint: string,
    params: Record<string, any> = {}
  ): Promise<AxiosResponse<T>> {
    return apiAxios.delete<T>(endpoint, { params });
  }
}

const apiService = new ApiService();

export default apiService;
