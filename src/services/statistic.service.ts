import { AxiosResponse } from "axios";
import apiService from "./api.service";

class StatisticService {
  getTop(): Promise<AxiosResponse> {
    return apiService.get("/statistics/top");
  }
}

const statisticService = new StatisticService();
export default statisticService;
