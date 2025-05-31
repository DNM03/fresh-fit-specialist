import {
  AddDishData,
  AddUpdateDishIngredientData,
  UpdateDishData,
} from "@/types/dish.type";
import apiService from "./api.service";

class DishService {
  searchDishes({
    search,
    page,
    limit,
    sort_by,
    order_by,
  }: {
    search?: string;
    page?: number;
    limit?: number;
    sort_by?: string;
    order_by?: string;
  }): Promise<any> {
    return apiService.get(
      `/dishes/search?search=${search}&page=${page}&limit=${limit}&sort_by=${sort_by}&order_by=${order_by}`
    );
  }
  searchDishByIngredient({
    ingredients,
    page,
    limit,
    sort_by,
    order_by,
  }: {
    ingredients: string[];
    page?: number;
    limit?: number;
    sort_by?: string;
    order_by?: string;
  }): Promise<any> {
    return apiService.get(
      `/dishes/search?ingredients=${ingredients.join(
        "|"
      )}&page=${page}&limit=${limit}&sort_by=${sort_by}&order_by=${order_by}`
    );
  }
  getDishById(id: string): Promise<any> {
    return apiService.get(`/dishes/${id}`);
  }
  getDishIngredientDetail(id: string, ingredientId: string): Promise<any> {
    return apiService.get(`/dishes/${id}/ingredients/${ingredientId}`);
  }
  addDish(dishData: AddDishData): Promise<any> {
    return apiService.post("/dishes", dishData);
  }
  updateDishInfo(id: string, dishData: UpdateDishData): Promise<any> {
    return apiService.patch(`/dishes/${id}`, dishData);
  }
  updateDishIngredient(
    id: string,
    ingredientId: string,
    dishData: AddUpdateDishIngredientData
  ): Promise<any> {
    return apiService.patch(
      `/dishes/${id}/ingredients/${ingredientId}`,
      dishData
    );
  }
  deleteDishIngredient(id: string, ingredientId: string): Promise<any> {
    return apiService.delete(`/dishes/${id}/ingredients/${ingredientId}`);
  }
  addDishIngredient(
    id: string,
    dishData: AddUpdateDishIngredientData
  ): Promise<any> {
    return apiService.post(`/dishes/${id}/ingredients`, dishData);
  }
  ratingDish(id: string, rating: number): Promise<any> {
    return apiService.post(`/dishes/${id}/rating`, { value: rating });
  }
}

const dishService = new DishService();
export default dishService;
