import { AddSet } from "@/types/set.type";
import { AxiosResponse } from "axios";
import apiService from "./api.service";

class SetService {
  addSet(data: AddSet): Promise<AxiosResponse> {
    return apiService.post("/sets", data);
  }
  updateSet(id: string, data: AddSet): Promise<AxiosResponse> {
    return apiService.patch(`/sets/${id}`, data);
  }
  deleteSet(id: string): Promise<AxiosResponse> {
    return apiService.delete(`/sets/${id}`);
  }
  getSetById(id: string): Promise<AxiosResponse> {
    return apiService.get(`/sets/${id}`);
  }
  searchSet({
    page,
    limit,
    sort_by,
    order_by,
    type,
    min_calories,
    max_calories,
  }: {
    page?: number;
    limit?: number;
    sort_by?: string;
    order_by?: string;
    type?: string;
    min_calories?: number;
    max_calories?: number;
  }): Promise<AxiosResponse> {
    return apiService.get(
      `/sets?page=${page}&limit=${limit}&sort_by=${sort_by}&order_by=${order_by}&type=${type}&min_calories=${min_calories}&max_calories=${max_calories}`
    );
  }
  cloneSet(set_ids: string[]): Promise<AxiosResponse> {
    return apiService.post(`/sets/clone`, {
      set_ids,
    });
  }
}

const setService = new SetService();
export default setService;
