import { ReportData } from "@/types/report.type";
import { AxiosResponse } from "axios";
import apiService from "./api.service";

class ReportService {
  reportToAdmin(reportData: ReportData): Promise<AxiosResponse> {
    return apiService.post("/report", reportData);
  }
}

const reportService = new ReportService();

export default reportService;
