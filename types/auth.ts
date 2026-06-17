import { LoginFormData } from "@/schemas/authSchemas";
// Generic response class for auth operations

export type UserResponse = {
    id: string;
    name: string;
    phone: string;
    ownerId: string | null;
    email: string;
    imageUrl: string;
    createdAt: string;
    updatedAt: string;
}

export interface MessageCodeFieldProps {
    value?: string;
    onChangeText?: (text: string) => void;
    error?: string;
    autoFocus?: boolean;
}

export interface AuthResponse<T = UserResponse> {
    status?: number;
    message: string;
    data?: T;
}

export class CustomApiError extends Error implements ApiError {
    statusCode: number;
    error?: string;
    details?: Details;

    constructor(message: string, statusCode: number, error?: string, details?: Details) {
        super(message);
        this.name = 'CustomApiError';
        this.statusCode = statusCode;
        this.error = error;
        this.details = details;
    }
}

export interface RegisterUserData {
    name: string
    phone: string
    email: string
    password: string
}

export interface SendVerificationCodeData {
    contact: string
}

export interface VerifyPhoneNumberData {
    contact: string
    code: string
}

export type VerifyPhoneNumberResponse = AuthResponse & {
    valid: boolean;
};

export type LoginResponseData = AuthResponse & {
    access_token: string;
    refresh_token: string;
};

export type ResetPasswordData = {
    password: string;
    token: string;
}

export interface ApiError {
    message: string
    statusCode: number
    error?: string
    details?: Details
}

export interface Details {
    message?: string
    statusCode?: number
    error?: string
}


export interface AuthUser {
    id: string;
    email: string;
    name: string;
    phone: string;
    imageUrl: string;
}

export interface UpdateProfileData {
    name?: string;
    email?: string;
    // phone?: string;
    picture?: RNFile;
}

export type RNFile = { uri: string; name: string; type: string };

export interface AuthState {
    // Connection state
    isConnected: boolean;
    isLoading: boolean;
    isLoadingProfile: boolean;
    isLoadingDeleteAccount: boolean;

    // Auth state
    isAuthenticated: boolean;
    user: AuthUser | null;
    redirectAfterLogin: string | null;

    // Error states
    connectionError: string | null;
    registrationError: string | null;
    loginError: string | null;
    logoutError: string | null;
    forgotPasswordError: string | null;
    sendVerificationError: string | null;
    verifyPhoneNumberError: string | null;
    updateProfileError: string | null;
    deleteAccountError: string | null;
    // Success states
    registrationSuccess: boolean;
    loginSuccess: boolean;
    forgotPasswordSuccess: boolean;
    sendVerificationSuccess: boolean;
    verifyPhoneNumberSuccess: boolean;
    updateProfileSuccess: boolean;
    deleteAccountSuccess: boolean;
    // Helper methods for state management
    setLoading: (loading: boolean) => void;
    setLoadingProfile: (loading: boolean) => void;
    setConnectionError: (error: string | null) => void;
    setRegistrationError: (error: string | null) => void;
    setLoginError: (error: string | null) => void;
    setLogoutError: (error: string | null) => void;
    setForgotPasswordError: (error: string | null) => void;
    setSendVerificationError: (error: string | null) => void;
    setVerifyPhoneNumberError: (error: string | null) => void;
    setUpdateProfileError: (error: string | null) => void;
    setDeleteAccountError: (error: string | null) => void;
    setConnected: (connected: boolean) => void;
    setRegistrationSuccess: (success: boolean) => void;
    setLoginSuccess: (success: boolean) => void;
    setForgotPasswordSuccess: (success: boolean) => void;
    setSendVerificationSuccess: (success: boolean) => void;
    setVerifyPhoneNumberSuccess: (success: boolean) => void;
    setUpdateProfileSuccess: (success: boolean) => void;
    setDeleteAccountSuccess: (success: boolean) => void;
    clearErrors: () => void;

    // Auth methods
    testConnection: () => Promise<boolean>;
    registerUser: (userData: RegisterUserData) => Promise<AuthResponse>;
    sendVerificationCode: (sendVerificationCodeData: SendVerificationCodeData) => Promise<AuthResponse>;
    verifyPhoneNumber: (verifyPhoneNumberData: VerifyPhoneNumberData) => Promise<VerifyPhoneNumberResponse>;
    loginUser: (loginData: LoginFormData) => Promise<boolean>;
    logoutUser: () => Promise<void>;
    updateProfile: (updateProfileData: UpdateProfileData) => Promise<AuthResponse>;
    forgotPassword: (phone: string) => Promise<boolean>;
    deleteAccount: () => Promise<AuthResponse>;
    setAuthData: (user: AuthUser) => void;
    initializeAuth: () => Promise<void>;
    clearAuthData: () => void;
    setRedirectAfterLogin: (path: string | null) => void;
    validateAuthTokens: () => Promise<boolean>;
}

// Lightweight wrapper for exposing HTTP status alongside the parsed data