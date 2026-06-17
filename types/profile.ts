export interface LoginPromptProps {
    onLogin: () => void;
    onCreateAccount: () => void;
}

export interface ProfileViewProps {
    username: string;
    userId: string;
    onLogout: () => void;
    isLoggingOut?: boolean;
}

export interface ProfileMenuProps {
    onTermsPress: () => void;
    onSupportPress: () => void;
    onLogout: () => void;
    isLoggingOut?: boolean;
}
