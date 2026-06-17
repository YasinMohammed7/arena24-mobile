import { ReactNode } from "react";

export interface PermissionDeniedProps {
    onRequestPermission: () => void;
    isCheckingPermission: boolean;
}

export interface PermissionLayoutProps {
    title: string;
    description: string;
    buttonText: string;
    onButtonPress: () => void;
    isLoading?: boolean;
    children?: ReactNode;
}
