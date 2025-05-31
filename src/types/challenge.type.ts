export interface AddUpdateChallengeData {
  name?: string;
  description?: string;
  type?: string;
  prize_image?: string;
  prize_title?: string;
  target: "WeightLoss" | "MuscleGain" | "Maintain" | "BuildBody";
  target_image: string;
  fat_percent: number;
  weight_loss_target: number;
  image: string;
  status: "Active" | "Inactive";
  start_date: string;
  end_date: string;
  health_plan_id?: string;
}
