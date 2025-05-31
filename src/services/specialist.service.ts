import { AxiosResponse } from "axios";
import apiService from "./api.service";

class SpecialistService {
  getSpecialists({
    page,
    limit,
    sort_by,
    order_by,
    search,
  }: {
    page?: number;
    limit?: number;
    sort_by?: string;
    order_by?: string;
    search?: string;
  }): Promise<AxiosResponse<any>> {
    return apiService.get<any>(
      `/experts?page=${page}&limit=${limit}${
        sort_by ? "&sort_by=" + sort_by : ""
      }${order_by ? "&order_by=" + order_by : ""}${
        search ? "&search=" + search : ""
      }`
    );
  }

  getSpecialistById(id: string): Promise<AxiosResponse<any>> {
    return apiService.get<any>(`/experts/${id}`);
  }
  getSpecialistByAccessToken(): Promise<AxiosResponse<any>> {
    return apiService.get<any>(`/experts/info/access-token`);
  }
  getSpecialistAvailableSlots({
    specialistId,
    month,
    year,
    isAvailable,
  }: {
    specialistId?: string;
    month?: number;
    year?: number;
    isAvailable?: boolean;
  }) {
    return apiService.get<any>(
      `/experts/availability/${specialistId}${month ? `?month=${month}` : ""}${
        year ? `&year=${year}` : ""
      }${isAvailable !== undefined ? `&isAvailable=${isAvailable}` : ""}`
    );
  }
  addAvailableSlot(data: any): Promise<AxiosResponse<any>> {
    return apiService.post<any>(`/experts/availability/set`, data);
  }
  updateAvailableSlot(id: string, data: any): Promise<AxiosResponse<any>> {
    return apiService.put<any>(`/experts/availability/${id}`, data);
  }
  deleteAvailableSlot(id: string): Promise<AxiosResponse<any>> {
    return apiService.delete<any>(`/experts/availability/${id}`);
  }
  getAppointmentById(id: string): Promise<AxiosResponse<any>> {
    return apiService.get<any>(`/appointments/${id}`);
  }
  cancelAppointment(id: string, data: any): Promise<AxiosResponse<any>> {
    return apiService.post<any>(`/appointments/${id}/cancel`, data);
  }
}
const specialistService = new SpecialistService();
export default specialistService;
