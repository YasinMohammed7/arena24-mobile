import { create } from 'zustand';
import { DateReservationStore } from '@/types/dateReservation';

const initialState = {
    selectedDate: "",
    selectedNumber: undefined,
    guestInput: "",
    selectedTimeSlotId: null,
    isAllDay: false,
};

export const useDateReservationStore = create<DateReservationStore>()((set, get) => ({
    ...initialState,

    // Actions
    setSelectedDate: (date: string) => {
        set({ selectedDate: date });
    },

    setSelectedNumber: (number: number | undefined) => {
        set({ selectedNumber: number });
    },

    setGuestInput: (guests: string) => {
        set({ guestInput: guests });
    },

    setSelectedTimeSlotId: (timeSlot: string | null) => {
        set({ selectedTimeSlotId: timeSlot });
    },

    setIsAllDay: (allDay: boolean) => {
        set({ isAllDay: allDay });
    },

    resetForm: () => {
        set(initialState);
    },

    // Validation for event type reservations
    isFormValidForEvent: () => {
        const state = get();
        return (
            state.selectedDate !== "" &&
            state.guestInput !== "" &&
            state.guestInput.trim() !== "" &&
            parseInt(state.guestInput) > 0
        );
    },

    // Validation for location type reservations
    isFormValidForLocation: () => {
        const state = get();
        return (
            state.selectedDate !== "" &&
            state.selectedNumber !== undefined &&
            state.selectedNumber > 0 &&
            state.selectedTimeSlotId !== null
        );
    },
}));
