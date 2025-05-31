export interface AddUpdateExerciseData {
  name: string;
  description?: string;
  category?: string;
  calories_burn_per_minute?: number;
  image?: string;
  video?: string;
  target_muscle?: {
    name: string;
    image?: string;
  };
  type?: string;
  equipment?: string;
  mechanics?: string;
  forceType?: string;
  experience_level?: string;
  secondary_muscle?: {
    name: string;
    image?: string;
  };
  instructions?: string;
  tips?: string;
}

export interface Exercise {
  _id: string;
  name: string;
  description?: string;
  category?: string;
  calories_burn_per_minute?: number;
  rating?: number;
  image?: string;
  video?: string;
  created_at?: string;
  updated_at?: string;
  target_muscle?: {
    name: string;
    description?: string;
    image?: string;
  };
  type?: string;
  equipment?: string;
  mechanics?: string;
  forceType?: string;
  experience_level?: string;
  secondary_muscle?: {
    name: string;
    description?: string;
    image?: string;
  };
  instructions?: string;
  tips?: string;
}
