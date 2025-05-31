import { AxiosResponse } from "axios";
import apiService from "./api.service";
import { AddUpdateExerciseData } from "@/types/exercise.type";

class ExerciseService {
  getAllForSelect(): Promise<AxiosResponse<any[]>> {
    return apiService.get<any[]>("/exercises/all");
  }
  searchExercise({
    search,
    page,
    limit,
    type,
    sort_by,
    order_by,
  }: {
    search?: string;
    page?: number;
    limit?: number;
    type?: string;
    sort_by?: string;
    order_by?: string;
  }): Promise<AxiosResponse<any[]>> {
    return apiService.get<any[]>(
      `/exercises?search=${search}&page=${page}&limit=${limit}&type=${type}&sort_by=${sort_by}&order_by=${order_by}`
    );
  }
  getExerciseById(id: string): Promise<AxiosResponse<any>> {
    return apiService.get<any>(`/exercises/${id}`);
  }
  addExercise(data: AddUpdateExerciseData): Promise<AxiosResponse<any>> {
    return apiService.post<any>("/exercises", data);
  }
  updateExercise(
    id: string,
    data: AddUpdateExerciseData
  ): Promise<AxiosResponse<any>> {
    return apiService.put<any>(`/exercises/${id}`, data);
  }
  deleteExercise(id: string): Promise<AxiosResponse<any>> {
    return apiService.delete<any>(`/exercises/${id}`);
  }
  ratingExercise(id: string, rating: number): Promise<AxiosResponse<any>> {
    return apiService.post<any>(`/exercises/${id}/rating`, { value: rating });
  }
}

const exerciseService = new ExerciseService();
export default exerciseService;
