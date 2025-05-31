export interface AddUpdateHealthPlanData {
  name: string;
  description?: string;
  estimated_calories_burned?: number;
  estimated_calories_intake?: number;
  status?: string;
  level?: string;
  start_date?: string;
  end_date?: string;
}
