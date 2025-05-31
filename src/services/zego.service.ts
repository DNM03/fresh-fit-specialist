import { AxiosResponse } from "axios";
import apiService from "./api.service";

class ZegoService {
  createZegoToken(): Promise<AxiosResponse> {
    return apiService.post("/users/zego-token");
  }
}

const zegoService = new ZegoService();
export default zegoService;
