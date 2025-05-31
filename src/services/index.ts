import authService, { apiAxios } from "./auth.service";
import apiService from "./api.service";
import userService from "./user.service";
import {
  User,
  UserSettings,
  ProfileUpdateData,
  PasswordChangeData,
  AuthResponse,
  RefreshTokenResponse,
  RegisterUserData,
  ResetPasswordData,
  CustomRequestConfig,
} from "@/types/user.type";

export {
  // Services
  authService,
  apiService,
  userService,
  apiAxios,

  // Types
  type User,
  type UserSettings,
  type ProfileUpdateData,
  type PasswordChangeData,
  type AuthResponse,
  type RefreshTokenResponse,
  type RegisterUserData,
  type ResetPasswordData,
  type CustomRequestConfig,
};
