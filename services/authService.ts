import apiClient from "./api";
import {
  RegisterUserData,
  LoginResponseData,
  CustomApiError,
  AuthResponse,
  SendVerificationCodeData,
  VerifyPhoneNumberData,
  VerifyPhoneNumberResponse,
  UpdateProfileData,
} from "@/types/auth";
import { LoginFormData } from "@/schemas/authSchemas";
import i18n from "@/i18n/config";
// Custom API Error class to preserve HTTP response details

class AuthService {
  // Test API connection
  async testConnection(): Promise<boolean> {
    try {
      await apiClient.get("/api/health");
      return true;
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        i18n.t("serviceErrors.connectionFailed");
      const statusCode = error.response?.status || 0;
      const errorType =
        error.response?.data?.error || i18n.t("serviceErrors.connectionFailed");
      throw new CustomApiError(
        message,
        statusCode,
        errorType,
        error.response?.data
      );
    }
  }

  // Register user
  async register(userData: RegisterUserData): Promise<AuthResponse> {
    try {
      const response = await apiClient.post("/api/auth/register", userData);
      return {
        status: response.status,
        message: response.data.message,
        data: response.data.data,
      };
    } catch (error: any) {
      // Preserve full HTTP error response details
      const message =
        error.response?.data?.message ||
        i18n.t("serviceErrors.registrationFailed");
      const statusCode = error.response?.status || 0;
      const errorType =
        error.response?.data?.error ||
        i18n.t("serviceErrors.registrationFailed");
      const details = error.response?.data;

      throw new CustomApiError(message, statusCode, errorType, details);
    }
  }

  // Verify phone number
  async sendVerificationCode(
    sendVerificationCodeData: SendVerificationCodeData
  ): Promise<AuthResponse> {
    try {
      const response = await apiClient.post(
        "/api/auth/send-verification",
        sendVerificationCodeData
      );
      return { message: response.data.message };
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        i18n.t("serviceErrors.phoneVerificationFailed");
      const statusCode = error.response?.status || 0;
      const errorType =
        error.response?.data?.error ||
        i18n.t("serviceErrors.phoneVerificationFailed");
      const details = error.response?.data;
      throw new CustomApiError(message, statusCode, errorType, details);
    }
  }

  // Verify phone number
  async verifyPhoneNumber(
    verifyPhoneNumberData: VerifyPhoneNumberData
  ): Promise<VerifyPhoneNumberResponse> {
    try {
      const response = await apiClient.post(
        "/api/auth/verify-code",
        verifyPhoneNumberData
      );
      return { message: response.data.message, valid: response.data.valid };
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        i18n.t("serviceErrors.phoneVerificationFailed");
      const statusCode = error.response?.status || 0;
      const errorType =
        error.response?.data?.error ||
        i18n.t("serviceErrors.phoneVerificationFailed");
      const details = error.response?.data;
      throw new CustomApiError(message, statusCode, errorType, details);
    }
  }

  // Login user
  async login(loginData: LoginFormData): Promise<LoginResponseData> {
    try {
      const response = await apiClient.post("/api/auth/login", loginData);
      return {
        status: response.status,
        message: response.data.message,
        access_token: response.data.access_token,
        refresh_token: response.data.refresh_token,
        data: response.data.data,
      };
    } catch (error: any) {
      const message =
        error.response?.data?.message || i18n.t("serviceErrors.loginFailed");
      const statusCode = error.response?.status || 0;
      const errorType =
        error.response?.data?.error || i18n.t("serviceErrors.loginFailed");
      throw new CustomApiError(
        message,
        statusCode,
        errorType,
        error.response?.data
      );
    }
  }

  // Logout user
  async logout(refreshToken: string): Promise<AuthResponse> {
    try {
      const response = await apiClient.post("/api/auth/logout", {
        refreshToken,
      });
      return { status: response.status, message: response.data.message };
    } catch (error: any) {
      console.log(error.response?.data);
      const message =
        error.response?.data?.message || i18n.t("serviceErrors.logoutFailed");
      const statusCode = error.response?.status || 0;
      const errorType =
        error.response?.data?.error || i18n.t("serviceErrors.logoutFailed");
      throw new CustomApiError(
        message,
        statusCode,
        errorType,
        error.response?.data
      );
    }
  }

  // Forgot password
  async forgotPassword(email: string): Promise<AuthResponse> {
    try {
      const response = await apiClient.post("/api/auth/forgot-password", {
        email,
      });
      return {
        status: response.status,
        message: response.data.message,
      };
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        i18n.t("serviceErrors.resetPhoneFailed");
      const statusCode = error.response?.status || 0;
      const errorType =
        error.response?.data?.error || i18n.t("serviceErrors.resetPhoneFailed");
      throw new CustomApiError(
        message,
        statusCode,
        errorType,
        error.response?.data
      );
    }
  }

  async refreshToken(refreshToken: string): Promise<LoginResponseData> {
    try {
      const response = await apiClient.post("/api/auth/refresh-token", {
        refreshToken,
      });
      return {
        status: response.status,
        message: response.data.message,
        access_token: response.data.access_token,
        refresh_token: response.data.refresh_token,
      };
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        i18n.t("serviceErrors.tokenRefreshFailed");
      const statusCode = error.response?.status || 0;
      const errorType =
        error.response?.data?.error ||
        i18n.t("serviceErrors.tokenRefreshFailed");
      throw new CustomApiError(
        message,
        statusCode,
        errorType,
        error.response?.data
      );
    }
  }

  async updateProfile(
    updateProfileData: UpdateProfileData
  ): Promise<AuthResponse> {
    try {
      const formData = new FormData();
      if (updateProfileData.name)
        formData.append("name", updateProfileData.name);
      if (updateProfileData.email)
        formData.append("email", updateProfileData.email);
      if (updateProfileData.picture) {
        formData.append("picture", updateProfileData.picture as any);
      }

      const response = await apiClient.patch(`/api/users`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      // console.log(response.data);
      return {
        status: response.status,
        message: response.statusText,
        data: response.data,
      };
    } catch (error: any) {
      console.log(error.response?.data);
      const message =
        error.response?.data?.message ||
        i18n.t("serviceErrors.profileUpdateFailed");
      const statusCode = error.response?.status || 0;
      const errorType =
        error.response?.data?.error ||
        i18n.t("serviceErrors.profileUpdateFailed");
      throw new CustomApiError(
        message,
        statusCode,
        errorType,
        error.response?.data
      );
    }
  }

  async deleteAccount(): Promise<AuthResponse> {
    try {
      const response = await apiClient.delete(`/api/users`);
      return { status: response.status, message: response.statusText };
    } catch (error: any) {
      console.log(error.response?.data);
      const message =
        error.response?.data?.message ||
        i18n.t("serviceErrors.accountDeletionFailed");
      const statusCode = error.response?.status || 0;
      const errorType =
        error.response?.data?.error ||
        i18n.t("serviceErrors.accountDeletionFailed");
      throw new CustomApiError(
        message,
        statusCode,
        errorType,
        error.response?.data
      );
    }
  }
}

export default new AuthService();
