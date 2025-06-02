import { AxiosRequestConfig } from "axios";

export interface User {
  _id: string;
  email: string;
  fullName?: string;
  date_of_birth?: string | null;
  verify?: number;
  gender?: number | null;
  role?: number;
  username?: string;
  avatar?: string;
  status?: string;
  height?: number | null;
  weight?: number | null;
  goal_weight?: number | null;
  level?: string;
  workout_plans?: string[];
  meals?: string[];
  waters?: string[];
  challenges?: string[];
  isOnline?: boolean;
  otp?: string | null;
  healthTrackings?: string[];
  created_at?: string;
  updated_at?: string;
  [key: string]: any;
}

export interface UserSettings {
  isChallenge?: boolean;
  isEating?: boolean;
  isWorkout?: boolean;
  isWater?: boolean;
  isAdmin?: boolean;
  isHealth?: boolean;
  [key: string]: any;
}

export interface ProfileUpdateData {
  username?: string;
  fuillName?: string;
  date_of_birth?: string | null;
  gender?: number | null;
  avatar?: string;
  height?: number | null;
  weight?: number | null;
  goal_weight?: number | null;
  level?: string;
  [key: string]: any;
}

export interface PasswordChangeData {
  old_password: string;
  new_password: string;
  confirm_password: string;
}

export interface AuthResponse {
  message: string;
  result: {
    access_token: string;
    refresh_token: string;
    role?: number;
    verify?: number;
  };
}

export interface RefreshTokenResponse {
  message: string;
  result: {
    access_token: string;
    refresh_token: string;
  };
}

export interface RegisterUserData {
  username: string;
  email: string;
  password: string;
  confirm_password: string;
  [key: string]: any;
}

export interface ResetPasswordData {
  forgot_password_token: string;
  password: string;
  confirm_password: string;
}

export interface ChangePasswordData {
  old_password: string;
  new_password: string;
  confirm_password: string;
}

export interface VerifyOtpCodeData {
  email: string;
  otp_code: string;
}

export interface AddWaterData {
  date: string;
  goal: number;
  step: number;
}

export interface AddHealthTrackingData {
  date: string;
  type: string;
  value: number;
  target: number;
}

export enum HealthActivityType {
  All = "All",
  Water = "Water",
  Consumed = "Consumed",
  Burned = "Burned",
}

export interface CreateDailyHealthSummaryData {
  height: number;
  weight: number;
  heartRate?: number;
  bloodPressure?: {
    systolic: number;
    diastolic: number;
  };
  sleep?: {
    duration: number;
    quality: number;
  };
  caloriesBurned?: number;
  caloriesConsumed?: number;
  waterIntake?: number;
  date: string;
}

export interface CustomRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}
