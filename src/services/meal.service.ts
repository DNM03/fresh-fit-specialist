import { AddMealData, Meal, UpdateMealData } from "@/types/meal.type";
import apiService from "./api.service";
import { AxiosResponse } from "axios";

class MealService {
  getMeals({
    page,
    limit,
    type,
    sort_by,
    order_by,
  }: {
    page?: number;
    limit?: number;
    type?: string;
    sort_by?: string;
    order_by?: string;
  }): Promise<AxiosResponse<Meal[]>> {
    return apiService.get<Meal[]>(
      `/meals?page=${page}&limit=${limit}&type=${type}&sort_by=${sort_by}&order_by=${order_by}`
    );
  }
  getMealById(id: string): Promise<AxiosResponse<Meal>> {
    return apiService.get<Meal>(`/meals/${id}`);
  }
  getMealByDate(date: string): Promise<AxiosResponse<Meal[]>> {
    return apiService.get<Meal[]>(`/meals/users?date=${date}`);
  }
  addNewMealPlan(mealData: AddMealData): Promise<AxiosResponse<Meal>> {
    return apiService.post<Meal>("/meals", mealData);
  }
  updateMealPlan(
    id: string,
    mealData: UpdateMealData
  ): Promise<AxiosResponse<Meal>> {
    return apiService.patch<Meal>(`/meals/${id}`, mealData);
  }
  deleteMealPlan(id: string): Promise<AxiosResponse> {
    return apiService.delete(`/meals/${id}`);
  }
  cloneMealPlan(
    meal_ids: string[],
    date: string
  ): Promise<AxiosResponse<Meal>> {
    return apiService.post<Meal>(`/meals/clone`, {
      meal_ids,
      date,
    });
  }
}

const mealService = new MealService();
export default mealService;
