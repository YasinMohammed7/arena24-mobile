import { create } from 'zustand';
import { ReservationDetails } from '@/types/reservations';

type DetailsReservationStore = {
    details: ReservationDetails;
    setDetails: (details: ReservationDetails) => void;
    setSpecialRequirements: (specialRequirements: string) => void;
    reset: () => void;
};

const initialDetails: ReservationDetails = {
    name: '',
    phone: '',
    specialRequirements: '',
};

export const useDetailsReservationStore = create<DetailsReservationStore>()((set, get) => ({
    details: initialDetails,

    setDetails: (details: ReservationDetails) => {
        set({ details });
    },

    setSpecialRequirements: (specialRequirements: string) => {
        const current = get().details;
        set({ details: { ...current, specialRequirements } });
    },

    reset: () => set({ details: initialDetails }),
}));


