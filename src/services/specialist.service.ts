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
  getDashBoardStats(): Promise<AxiosResponse<any>> {
    return apiService.get<any>(`/experts/statistic/general`);
  }
  updateGeneralInfo(id: string, data: any): Promise<AxiosResponse<any>> {
    return apiService.patch<any>(`/experts/${id}`, data);
  }
  updateSkills(id: string, data: any): Promise<AxiosResponse<any>> {
    return apiService.put<any>(`/experts/${id}/skills`, data);
  }
  addCertification(id: string, data: any): Promise<AxiosResponse<any>> {
    return apiService.post<any>(`/experts/${id}/certifications`, data);
  }
  updateCertification(
    expertId: string,
    certificationId: string,
    data: any
  ): Promise<AxiosResponse<any>> {
    return apiService.patch<any>(
      `/experts/${expertId}/certifications/${certificationId}`,
      data
    );
  }
  deleteCertification(
    expertId: string,
    data?: any
  ): Promise<AxiosResponse<any>> {
    return apiService.delete<any>(`/experts/${expertId}/certifications`, {
      data: data,
    });
  }
  addEducation(id: string, data: any): Promise<AxiosResponse<any>> {
    return apiService.post<any>(`/experts/${id}/educations`, data);
  }
  updateEducation(
    expertId: string,
    educationId: string,
    data: any
  ): Promise<AxiosResponse<any>> {
    return apiService.patch<any>(
      `/experts/${expertId}/educations/${educationId}`,
      data
    );
  }
  deleteEducation(expertId: string, data?: any): Promise<AxiosResponse<any>> {
    return apiService.delete<any>(`/experts/${expertId}/educations`, {
      data: data,
    });
  }
  addExperience(id: string, data: any): Promise<AxiosResponse<any>> {
    return apiService.post<any>(`/experts/${id}/experiences`, data);
  }
  updateExperience(
    expertId: string,
    experienceId: string,
    data: any
  ): Promise<AxiosResponse<any>> {
    return apiService.patch<any>(
      `/experts/${expertId}/experiences/${experienceId}`,
      data
    );
  }
  deleteExperience(expertId: string, data?: any): Promise<AxiosResponse<any>> {
    return apiService.delete<any>(`/experts/${expertId}/experiences`, {
      data: data,
    });
  }
}
const specialistService = new SpecialistService();
export default specialistService;
