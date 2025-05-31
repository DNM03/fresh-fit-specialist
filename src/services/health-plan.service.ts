import { AxiosResponse } from "axios";
import apiService from "./api.service";
import { AddUpdateHealthPlanData } from "@/types/health-plan.type";

class HealthPlanService {
  generateHealthPlan(): Promise<AxiosResponse> {
    return apiService.get("/users/generate-health-plan");
  }
  createNewHealthPlan(
    healthPlanData: AddUpdateHealthPlanData
  ): Promise<AxiosResponse> {
    return apiService.post("/health-plans", healthPlanData);
  }
  updateHealthPlan(
    healthPlanData: AddUpdateHealthPlanData
  ): Promise<AxiosResponse> {
    return apiService.put("/health-plans", healthPlanData);
  }
  searchHealthPlan(
    search?: string,
    page?: number,
    limit?: number,
    level?: string,
    sort_by?: string,
    order_by?: string,
    status?: string,
    source?: string
  ): Promise<AxiosResponse> {
    return apiService.get(
      `/health-plans?search=${search}&page=${page}&limit=${limit}&level=${level}&sort_by=${sort_by}&order_by=${order_by}&status=${status}&source=${source}`
    );
  }
  getHealthPlanById(id: string): Promise<AxiosResponse> {
    return apiService.get(`/health-plans/${id}`);
  }
  deleteHealthPlan(id: string): Promise<AxiosResponse> {
    return apiService.delete(`/health-plans/${id}`);
  }
  getAllHealthPlanDetailsById(
    id: string,
    week?: number
  ): Promise<AxiosResponse> {
    return apiService.get(`/health-plan-details/all/${id}?week=${week}`);
  }
  getHealthPlanDetailsById(id: string): Promise<AxiosResponse> {
    return apiService.get(`/health-plan-details/${id}`);
  }
}

const healthPlanService = new HealthPlanService();
export default healthPlanService;
