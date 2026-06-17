export interface WaiterModalProps {
    visible: boolean;
    onClose: () => void;
    onConfirm: () => void;
    loading?: boolean;
}

export interface BillModalProps {
    visible: boolean;
    onClose: () => void;
    onConfirm: () => void;
    loading?: boolean;
}

export type AmenityModalProps = {
    visible: boolean;
    onClose: () => void;
    onConfirm: () => void;
    loading?: boolean;
    text: string;
}

export interface ServiceRequestResult {
    success: boolean;
    message?: string;
    error?: string;
}

export interface ServiceRequestParams {
    locationId: number;
    locationName: string;
    amenityId?: number;
    amenityName?: string;
    amenityDescription?: string;
}