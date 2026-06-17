export interface DropdownData {
    label: string;
    value: string;
}

export interface DropdownProps {
    data: DropdownData[];
    placeholder: string;
    searchPlaceholder: string;
    leftIcon: React.ReactNode;
    rightIcon: React.ReactNode;
    width?: string;
    selectedPlaceholder?: string;
    value?: string[]; // For controlled component
    onValueChange?: (value: string[]) => void; // For controlled component
}