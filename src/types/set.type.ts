export interface AddSet {
  name: string;
  type?: string;
  description?: string;
  number_of_exercises?: number;
  set_exercises?: {
    exercise_id: string;
    duration?: number;
    reps?: number;
    round?: number;
    rest_per_round?: number;
    estimated_calories_burned?: number;
  }[];
  time?: string;
  image?: string;
  total_calories?: number;
  is_youtube_workout?: boolean;
  youtube_id?: string;
}

export interface UpdateSet extends AddSet {
  status?: string;
}
