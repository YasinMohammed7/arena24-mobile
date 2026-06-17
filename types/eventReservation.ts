export interface EventReservationState {
    selectedEventType: string;
    selectedBudget: string;
    needsStaff: boolean | null;
    needsDJ: boolean | null;
    needsValetParking: boolean | null;
    needsSecurity: boolean | null;
    needsHostess: boolean | null;
    needsWardrobe: boolean | null;
}

export interface EventReservationActions {
    setEventType: (eventType: string) => void;
    setBudget: (budget: string) => void;
    setNeedsStaff: (needs: boolean | null) => void;
    setNeedsDJ: (needs: boolean | null) => void;
    setNeedsValetParking: (needs: boolean | null) => void;
    setNeedsSecurity: (needs: boolean | null) => void;
    setNeedsHostess: (needs: boolean | null) => void;
    setNeedsWardrobe: (needs: boolean | null) => void;
    resetForm: () => void;
    isFormValid: () => boolean;
}

export interface EventReservationStore extends EventReservationState, EventReservationActions { }

// Event Booking Screen Types
export interface EventBookingState {
    eventId: string;
    eventName: string;
    restaurantName: string;
    numberOfParticipants: number;
    specialRequirements: string;
    pricePerPerson: number;
}

export interface EventBookingActions {
    setEventId: (eventId: string) => void;
    setEventName: (eventName: string) => void;
    setRestaurantName: (restaurantName: string) => void;
    setNumberOfParticipants: (count: number) => void;
    setSpecialRequirements: (requirements: string) => void;
    setPricePerPerson: (price: number) => void;
    getTotalPrice: () => number;
    resetBooking: () => void;
}

export interface EventBookingStore extends EventBookingState, EventBookingActions { }