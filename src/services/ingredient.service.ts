import { AxiosResponse } from "axios";
import apiService from "./api.service";
import { Ingredient } from "@/types/ingredient.type";
import { AddUpdateHealthPlanData } from "@/types/health-plan.type";

class IngredientService {
  getIngredients({
    page,
    limit,
    sort_by,
    order_by,
  }: {
    page?: number;
    limit?: number;
    sort_by?: string;
    order_by?: string;
  }): Promise<AxiosResponse<Ingredient[]>> {
    return apiService.get<Ingredient[]>(
      `/ingredients?page=${page}&limit=${limit}&sort_by=${sort_by}&order_by=${order_by}`
    );
  }
  getIngredientById(id: string): Promise<AxiosResponse<Ingredient>> {
    return apiService.get<Ingredient>(`/ingredients/${id}`);
  }
  addIngredient(
    ingredientData: AddUpdateHealthPlanData
  ): Promise<AxiosResponse<Ingredient>> {
    return apiService.post<Ingredient>("/ingredients", ingredientData);
  }
  updateIngredient(
    id: string,
    ingredientData: AddUpdateHealthPlanData
  ): Promise<AxiosResponse<Ingredient>> {
    return apiService.patch<Ingredient>(`/ingredients/${id}`, ingredientData);
  }
  deleteIngredient(id: string): Promise<AxiosResponse> {
    return apiService.delete(`/ingredients/${id}`);
  }
}

const ingredientService = new IngredientService();
export default ingredientService;
