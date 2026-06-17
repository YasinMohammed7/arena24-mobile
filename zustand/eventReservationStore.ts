import { create } from 'zustand';
import { EventReservationStore } from '@/types/eventReservation';

const initialState = {
    selectedEventType: "",
    selectedBudget: "",
    needsStaff: null,
    needsDJ: null,
    needsValetParking: null,
    needsSecurity: null,
    needsHostess: null,
    needsWardrobe: null,
};

export const useEventReservationStore = create<EventReservationStore>()((set, get) => ({
    ...initialState,

    // Actions
    setEventType: (eventType: string) => {
        set({ selectedEventType: eventType });
    },

    setBudget: (budget: string) => {
        set({ selectedBudget: budget });
    },

    setNeedsStaff: (needs: boolean | null) => {
        set({ needsStaff: needs });
    },

    setNeedsDJ: (needs: boolean | null) => {
        set({ needsDJ: needs });
    },

    setNeedsValetParking: (needs: boolean | null) => {
        set({ needsValetParking: needs });
    },

    setNeedsSecurity: (needs: boolean | null) => {
        set({ needsSecurity: needs });
    },

    setNeedsHostess: (needs: boolean | null) => {
        set({ needsHostess: needs });
    },

    setNeedsWardrobe: (needs: boolean | null) => {
        set({ needsWardrobe: needs });
    },

    resetForm: () => {
        set(initialState);
    },

    isFormValid: () => {
        const state = get();
        return (
            state.selectedEventType !== "" &&
            state.selectedBudget !== "" &&
            state.needsStaff !== null &&
            state.needsDJ !== null &&
            state.needsValetParking !== null &&
            state.needsSecurity !== null &&
            state.needsHostess !== null &&
            state.needsWardrobe !== null
        );
    },
}));
