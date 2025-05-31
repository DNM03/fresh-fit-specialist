import { AddUpdateChallengeData } from "@/types/challenge.type";
import { AxiosResponse } from "axios";
import apiService from "./api.service";

class ChallengeService {
  addChallenge(challenge: AddUpdateChallengeData): Promise<AxiosResponse> {
    return apiService.post<AxiosResponse>("/challenges", challenge);
  }
  updateChallenge(
    id: string,
    challenge: AddUpdateChallengeData
  ): Promise<AxiosResponse> {
    return apiService.patch<AxiosResponse>(`/challenges/${id}`, challenge);
  }
  deleteChallenge(id: string): Promise<AxiosResponse> {
    return apiService.delete<AxiosResponse>(`/challenges/${id}`);
  }
  getChallengeById(id: string): Promise<AxiosResponse> {
    return apiService.get<AxiosResponse>(`/challenges/${id}`);
  }
  searchChallenge({
    page,
    limit,
    type,
    sort_by,
    order_by,
    status,
  }: {
    page?: number;
    limit?: number;
    type?: string;
    sort_by?: string;
    order_by?: string;
    status?: string;
  }): Promise<AxiosResponse> {
    return apiService.get(
      `/challenges?page=${page}&limit=${limit}&type=${type}&sort_by=${sort_by}&order_by=${order_by}&status=${status}`
    );
  }
  activateChallenge(id: string): Promise<AxiosResponse> {
    return apiService.post<AxiosResponse>(`/challenges/${id}/activate`);
  }
  deactivateChallenge(id: string): Promise<AxiosResponse> {
    return apiService.post<AxiosResponse>(`/challenges/${id}/deactivate`);
  }
}

const challengeService = new ChallengeService();
export default challengeService;
