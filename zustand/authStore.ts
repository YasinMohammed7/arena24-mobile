import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authService from '@/services/authService';
import {
  RegisterUserData,
  AuthUser,
  AuthState,
  SendVerificationCodeData,
  VerifyPhoneNumberData,
  UpdateProfileData,
} from '@/types/auth';
import { LoginFormData } from '@/schemas/authSchemas';
import i18n from '@/i18n/config';

export const useAuthStore = create<AuthState>((set, get) => ({
  // Connection state
  isConnected: false,
  isLoading: false,
  isLoadingProfile: false,
  isLoadingDeleteAccount: false,
  // Auth state
  isAuthenticated: false,
  user: null,
  redirectAfterLogin: null,

  // Error states
  connectionError: null,
  registrationError: null,
  loginError: null,
  logoutError: null,
  forgotPasswordError: null,
  sendVerificationError: null,
  verifyPhoneNumberError: null,
  updateProfileError: null,
  deleteAccountError: null,
  // Success states
  registrationSuccess: false,
  loginSuccess: false,
  forgotPasswordSuccess: false,
  sendVerificationSuccess: false,
  verifyPhoneNumberSuccess: false,
  updateProfileSuccess: false,
  deleteAccountSuccess: false,
  // Helper methods for state management
  setLoading: (loading: boolean) => set({ isLoading: loading }),
  setLoadingProfile: (loading: boolean) => set({ isLoadingProfile: loading }),
  setConnectionError: (error: string | null) => set({ connectionError: error }),

  setRegistrationError: (error: string | null) =>
    set({ registrationError: error }),

  setLoginError: (error: string | null) => set({ loginError: error }),

  setLogoutError: (error: string | null) => set({ logoutError: error }),

  setForgotPasswordError: (error: string | null) =>
    set({ forgotPasswordError: error }),

  setSendVerificationError: (error: string | null) =>
    set({ sendVerificationError: error }),

  setVerifyPhoneNumberError: (error: string | null) =>
    set({ verifyPhoneNumberError: error }),

  setUpdateProfileError: (error: string | null) =>
    set({ updateProfileError: error }),

  setDeleteAccountError: (error: string | null) =>
    set({ deleteAccountError: error }),

  setConnected: (connected: boolean) => set({ isConnected: connected }),

  setRegistrationSuccess: (success: boolean) =>
    set({ registrationSuccess: success }),

  setLoginSuccess: (success: boolean) => set({ loginSuccess: success }),

  setForgotPasswordSuccess: (success: boolean) =>
    set({ forgotPasswordSuccess: success }),

  setSendVerificationSuccess: (success: boolean) =>
    set({ sendVerificationSuccess: success }),

  setVerifyPhoneNumberSuccess: (success: boolean) =>
    set({ verifyPhoneNumberSuccess: success }),

  setUpdateProfileSuccess: (success: boolean) =>
    set({ updateProfileSuccess: success }),

  setDeleteAccountSuccess: (success: boolean) =>
    set({ deleteAccountSuccess: success }),

  clearErrors: () =>
    set({
      connectionError: null,
      registrationError: null,
      loginError: null,
      logoutError: null,
      forgotPasswordError: null,
      sendVerificationError: null,
      verifyPhoneNumberError: null,
      updateProfileError: null,
      deleteAccountError: null,
    }),

  // Test connection method
  testConnection: async () => {
    set({ isLoading: true, connectionError: null });

    try {
      const isConnected = await authService.testConnection();
      set({ isConnected: true, isLoading: false });
      return isConnected;
    } catch (error: any) {
      set({
        isConnected: false,
        isLoading: false,
        connectionError: error.message,
      });
      return false;
    }
  },

  // Registration method
  registerUser: async (userData: RegisterUserData) => {
    set({
      isLoading: true,
      registrationError: null,
      registrationSuccess: false,
    });

    try {
      const response = await authService.register(userData);
      set({ isLoading: false, registrationSuccess: true });
      return response;
    } catch (error: any) {
      let errorMessage: string = '';
      switch (error.statusCode) {
        case 400:
          errorMessage = i18n.t('authErrors.invalidData');
          break;
        case 409:
          errorMessage = i18n.t('authErrors.accountExists');
          break;
        default:
          errorMessage = i18n.t('authErrors.genericError');
          break;
      }
      set({ isLoading: false, registrationError: errorMessage });
      throw new Error(errorMessage);
    }
  },

  // Send verification code method
  sendVerificationCode: async (
    sendVerificationCodeData: SendVerificationCodeData
  ) => {
    set({
      isLoading: true,
      sendVerificationError: null,
      sendVerificationSuccess: false,
    });

    try {
      const response = await authService.sendVerificationCode(
        sendVerificationCodeData
      );
      set({ isLoading: false, sendVerificationSuccess: true });
      return response;
    } catch (error: any) {
      let errorMessage: string = '';
      switch (error.statusCode) {
        case 400:
          errorMessage = i18n.t('authErrors.invalidPhone');
          break;
        case 429:
          errorMessage = i18n.t('authErrors.tooManyAttempts');
          break;
        default:
          errorMessage = i18n.t('authErrors.smsError');
          break;
      }
      set({ isLoading: false, sendVerificationError: errorMessage });
      throw new Error(errorMessage);
    }
  },

  // Verify phone number method
  verifyPhoneNumber: async (verifyPhoneNumberData: VerifyPhoneNumberData) => {
    set({
      isLoading: true,
      verifyPhoneNumberError: null,
      verifyPhoneNumberSuccess: false,
    });

    try {
      const response = await authService.verifyPhoneNumber(
        verifyPhoneNumberData
      );
      set({ isLoading: false, verifyPhoneNumberSuccess: response.valid });
      return response;
    } catch (error: any) {
      let errorMessage: string = '';
      switch (error.statusCode) {
        case 400:
          errorMessage = i18n.t('authErrors.invalidCode');
          break;
        case 410:
          errorMessage = i18n.t('authErrors.expiredCode');
          break;
        case 422:
          errorMessage = i18n.t('authErrors.invalidCode');
          break;
        default:
          errorMessage = i18n.t('authErrors.verificationError');
          break;
      }
      set({ isLoading: false, verifyPhoneNumberError: errorMessage });
      throw new Error(errorMessage);
    }
  },

  // Login method
  loginUser: async (loginData: LoginFormData) => {
    set({ isLoading: true, loginError: null, loginSuccess: false });

    try {
      const response = await authService.login(loginData);
      if (response.status === 201) {
        try {
          // Store in AsyncStorage with error handling
          await AsyncStorage.multiSet([
            ['accessToken', response.access_token],
            ['refreshToken', response.refresh_token],
            ['user', JSON.stringify(response.data)],
          ]);

          set({
            isLoading: false,
            user: response.data,
            loginSuccess: true,
            isAuthenticated: true,
          });
        } catch (storageError) {
          console.error(
            'Failed to save login data to AsyncStorage:',
            storageError
          );
          // If storage fails, don't set authenticated state
          set({
            isLoading: false,
            loginError: i18n.t('authErrors.saveFailed'),
          });
          return false;
        }
      }
      return true;
    } catch (error: any) {
      let errorMessage: string = '';
      switch (error.statusCode) {
        case 401:
          errorMessage = i18n.t('authErrors.incorrectCredentials');
          break;
        case 404:
          errorMessage = i18n.t('authErrors.accountNotFound');
          break;
        default:
          errorMessage = i18n.t('authErrors.genericError');
          break;
      }
      set({ isLoading: false, loginError: errorMessage });
      return false;
    }
  },

  setAuthData: (user: AuthUser) => {
    set({
      isAuthenticated: true,
      user,
    });
  },

  // Initialize auth state from AsyncStorage on app startup
  initializeAuth: async () => {
    try {
      const [accessToken, refreshToken, userData] = await Promise.all([
        AsyncStorage.getItem('accessToken'),
        AsyncStorage.getItem('refreshToken'),
        AsyncStorage.getItem('user'),
      ]);

      if (accessToken && refreshToken && userData) {
        const user = JSON.parse(userData);
        set({
          isAuthenticated: true,
          user,
        });
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
      // Clear any corrupt data
      await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'user']);
    }
  },
  // Logout method
  logoutUser: async () => {
    set({ isLoading: true, logoutError: null });

    try {
      console.log('Get refresh token');
      const refreshToken = await AsyncStorage.getItem('refreshToken');
      console.log('Refresh token', refreshToken);
      if (!refreshToken) {
        // Clear local data even if no refresh token
        await AsyncStorage.removeItem('accessToken');
        await AsyncStorage.removeItem('refreshToken');
        await AsyncStorage.removeItem('user');

        set({
          isLoading: false,
          isAuthenticated: false,
          user: null,
        });
      }

      const response = await authService.logout(refreshToken ?? '');
      console.log('Logout response:', response);
      if (response.status === 200) {
        set({
          isLoading: false,
          isAuthenticated: false,
          user: null,
        });
        await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'user']);
      } else {
        set({
          isLoading: false,
          isAuthenticated: false,
          user: null,
        });
        await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'user']);
      }

      set({
        isLoading: false,
        isAuthenticated: false,
        user: null,
      });
    } catch (error: any) {
      console.error('Logout error:', error);
      // Clear local data even if server logout fails
      await AsyncStorage.removeItem('accessToken');
      await AsyncStorage.removeItem('refreshToken');
      await AsyncStorage.removeItem('user');

      set({
        isLoading: false,
        isAuthenticated: false,
        user: null,
        logoutError: i18n.t('authErrors.logoutError'),
      });
    }
  },

  // Forgot password method
  forgotPassword: async (phone: string) => {
    set({
      isLoading: true,
      forgotPasswordError: null,
      forgotPasswordSuccess: false,
    });

    try {
      await authService.forgotPassword(phone);
      set({
        isLoading: false,
        forgotPasswordSuccess: true,
      });
      return true;
    } catch (error: any) {
      let errorMessage: string = '';
      switch (error.statusCode) {
        case 404:
          errorMessage = i18n.t('authErrors.phoneNotFound');
          break;
        default:
          errorMessage = i18n.t('authErrors.genericError');
          break;
      }
      set({ isLoading: false, forgotPasswordError: errorMessage });
      return false;
    }
  },

  // Set auth data (for token refresh or manual login)

  // Clear auth data
  clearAuthData: () => {
    set({
      isAuthenticated: false,
      user: null,
      redirectAfterLogin: null,
    });
  },

  setRedirectAfterLogin: (path: string | null) => {
    set({ redirectAfterLogin: path });
  },

  // Check if tokens exist and clear auth state if they don't
  validateAuthTokens: async () => {
    try {
      const [accessToken, refreshToken] = await Promise.all([
        AsyncStorage.getItem('accessToken'),
        AsyncStorage.getItem('refreshToken'),
      ]);

      if (!accessToken || !refreshToken) {
        set({
          isAuthenticated: false,
          user: null,
        });
        await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'user']);
        return false;
      }
      return true;
    } catch (error) {
      set({
        isAuthenticated: false,
        user: null,
      });
      await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'user']);
      return false;
    }
  },

  updateProfile: async (updateProfileData: UpdateProfileData) => {
    const { isAuthenticated, user } = get();

    if (!isAuthenticated || !user) {
      const errorMessage = i18n.t('authErrors.notAuthenticated');
      set({ updateProfileError: errorMessage });
      throw new Error(errorMessage);
    }

    set({
      isLoadingProfile: true,
      updateProfileError: null,
      updateProfileSuccess: false,
    });

    try {
      const response = await authService.updateProfile(updateProfileData);
      console.log('UpdateProfile response:', response);

      // Actualizează datele user-ului în store cu noile date
      if (response.data) {
        const updatedUser = response.data;

        // Actualizează store-ul
        set({
          isLoadingProfile: false,
          updateProfileSuccess: true,
          user: updatedUser,
        });

        // Actualizează AsyncStorage
        await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
        // console.log("Updated user saved in AsyncStorage", updatedUser)
      }
      return response;
    } catch (error: any) {
      let errorMessage: string = '';
      switch (error.statusCode) {
        case 400:
          errorMessage = i18n.t('authErrors.invalidData');
          break;
        case 401:
          errorMessage = i18n.t('authErrors.noPermissionUpdate');
          break;
        default:
          errorMessage = i18n.t('authErrors.genericError');
          break;
      }
      set({ isLoadingProfile: false, updateProfileError: errorMessage });
      throw new Error(errorMessage);
    }
  },

  deleteAccount: async () => {
    set({
      isLoadingDeleteAccount: true,
      deleteAccountError: null,
      deleteAccountSuccess: false,
    });

    try {
      const response = await authService.deleteAccount();

      // Clear AsyncStorage
      await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'user']);

      // Clear auth state in store immediately
      set({
        isLoadingDeleteAccount: false,
        deleteAccountSuccess: true,
        isAuthenticated: false,
        user: null,
      });

      return response;
    } catch (error: any) {
      let errorMessage: string = '';
      switch (error.statusCode) {
        case 400:
          errorMessage = i18n.t('authErrors.noPermissionDelete');
          break;
        case 401:
          errorMessage = i18n.t('authErrors.noPermissionDelete');
          break;
        case 403:
          errorMessage = i18n.t('authErrors.noPermissionDelete');
          break;
        default:
          errorMessage = i18n.t('authErrors.genericError');
          break;
      }

      // Clear AsyncStorage and auth state even on error for security
      await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'user']);
      set({
        isLoadingDeleteAccount: false,
        deleteAccountError: errorMessage,
        isAuthenticated: false,
        user: null,
      });
      throw new Error(errorMessage);
    }
  },
}));
