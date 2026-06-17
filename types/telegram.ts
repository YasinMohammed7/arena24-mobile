import type { ServiceRequestResult, ServiceRequestParams } from '@/types/modal';

export interface TelegramMessage {
    chat_id: string | number;
    text: string;
    parse_mode?: 'HTML' | 'Markdown' | 'MarkdownV2';
}

export interface TelegramResponse {
    ok: boolean;
    result?: any;
    error_code?: number;
    description?: string;
}

export interface ServiceRequest {
    restaurantName: string;
    restaurantId: number;
    timestamp: string;
    tableNumber?: string;
    type: string;
}

export interface AmenityRequest extends ServiceRequest {
    amenityName: string;
    amenityDescription: string;
}


export interface ServiceRequestRecord {
    locationId: number;
    serviceType: 'waiter' | 'bill' | 'amenity';
    amenityId?: number; // Only for amenity requests
    timestamp: number;
}

export interface ServiceRequestState {
    requests: ServiceRequestRecord[];
    lastUpdate: number; // Timestamp to trigger reactive updates
    addRequest: (locationId: number, serviceType: 'waiter' | 'bill' | 'amenity', amenityId?: number) => Promise<void>;
    isInCooldown: (locationId: number, serviceType: 'waiter' | 'bill' | 'amenity', amenityId?: number) => boolean;
    getCooldownRemaining: (locationId: number, serviceType: 'waiter' | 'bill' | 'amenity', amenityId?: number) => number;
    cleanupExpiredRequests: () => Promise<void>;
    initializeStore: () => Promise<void>;
    triggerUpdate: () => void; // Force a re-render
    clearAllTimers: () => void; // Clean up all active timers

    // Service request methods that handle both telegram and cooldown
    sendWaiterRequest: (params: ServiceRequestParams) => Promise<ServiceRequestResult>;
    sendBillRequest: (params: ServiceRequestParams) => Promise<ServiceRequestResult>;
    sendAmenityRequest: (params: ServiceRequestParams) => Promise<ServiceRequestResult>;
}