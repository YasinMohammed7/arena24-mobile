import { reservationEventData } from "./reservations";
import { ServerReservation } from "./serverReservation";

export interface ReservationsStore {
  // Loading states
  isLoading: boolean;
  isCreatingEventReservation: boolean;
  isLoadingReservations: boolean;

  // Error states
  error: string | null;
  eventReservationError: string | null;
  reservationsError: string | null;

  // Success states
  eventReservationSuccess: boolean;
  lastCreatedReservation: any | null;

  // Data states
  reservations: ServerReservation[] | null;

  // Actions
  createEventReservation: (data: reservationEventData) => Promise<void>;
  getAllReservationsByUser: (userId: string) => Promise<void>;
  connectSocket: () => void;
  disconnectSocket: () => void;
  clearErrors: () => void;
  clearSuccess: () => void;
  resetStore: () => void;
}
