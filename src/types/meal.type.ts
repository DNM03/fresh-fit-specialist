import { Dish } from "./dish.type";

export interface AddMealData {
  name: string;
  date?: string;
  description?: string;
  calories?: number;
  prep_time?: number;
  meal_type?: string;
  dishes?: string[]; // Array of dish IDs
}

export interface UpdateMealData {
  name?: string;
  date?: string;
  description?: string;
  calories?: number;
  prep_time?: number;
  meal_type?: string;
  dishes?: string[];
}

export interface Meal {
  _id: string;
  name: string;
  date?: string;
  description?: string;
  calories?: number;
  prep_time?: number;
  meal_type?: string;
  dishes?: Dish[];
  created_at?: string;
  updated_at?: string;
}
