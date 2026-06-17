export interface DateReservationState {
    selectedDate: string;
    selectedNumber: number | undefined; // pentru type "location"
    guestInput: string; // pentru type "event"
    selectedTimeSlotId: string | null; // pentru type "location"
    isAllDay: boolean; // pentru type "event"
}

export interface DateReservationActions {
    setSelectedDate: (date: string) => void;
    setSelectedNumber: (number: number | undefined) => void;
    setGuestInput: (guests: string) => void;
    setSelectedTimeSlotId: (timeSlot: string | null) => void;
    setIsAllDay: (allDay: boolean) => void;
    resetForm: () => void;
    isFormValidForEvent: () => boolean;
    isFormValidForLocation: () => boolean;
}

export interface DateReservationStore extends DateReservationState, DateReservationActions { }
