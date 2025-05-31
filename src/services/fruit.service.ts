import { AxiosResponse } from "axios";
import apiService from "./api.service";

class FruitService {
  getFruitsByName(name: string): Promise<AxiosResponse> {
    return apiService.get(`/fruits/${name}`);
  }
}

const fruitService = new FruitService();
export default fruitService;
