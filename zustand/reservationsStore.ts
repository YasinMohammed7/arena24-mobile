import { create } from "zustand";
import reservationService from "@/services/reservationService";
import {
  connectReservationsSocket,
  disconnectReservationsSocket,
} from "@/services/reservationSocket";
import { ReservationsStore } from "@/types/reservationsStore";
import i18n from "@/i18n/config";
import { reservationEventData } from "@/types/reservations";
import { ServerReservation } from "@/types/serverReservation";

const initialState = {
  isLoading: false,
  isCreatingEventReservation: false,
  isLoadingReservations: false,
  error: null,
  eventReservationError: null,
  reservationsError: null,
  eventReservationSuccess: false,
  lastCreatedReservation: null,
  reservations: [],
};

export const useReservationsStore = create<ReservationsStore>()((set) => ({
  ...initialState,

  // Actions
  createEventReservation: async (data: reservationEventData) => {
    try {
      set({
        isCreatingEventReservation: true,
        eventReservationError: null,
        eventReservationSuccess: false,
      });

      const response = await reservationService.createEventReservation(data);

      if (response.status === 201 || response.status === 200) {
        set({
          isCreatingEventReservation: false,
          eventReservationError: null,
          eventReservationSuccess: true,
          lastCreatedReservation: response.data,
        });
      } else {
        set({
          isCreatingEventReservation: false,
          eventReservationError: i18n.t("reservationErrors.creationError"),
        });
      }
    } catch (error: any) {
      let errorMessage: string = "";

      // Handle different status codes
      switch (error.statusCode) {
        case 400:
          errorMessage = error.details.message;
          break;
        case 401:
          errorMessage = i18n.t("reservationErrors.authRequired");
          break;
        case 403:
          errorMessage = i18n.t("reservationErrors.noPermission");
          break;
        case 404:
          errorMessage = i18n.t("reservationErrors.eventNotFound");
          break;
        case 409:
          errorMessage = i18n.t("reservationErrors.conflict");
          break;
        case 422:
          errorMessage = i18n.t("reservationErrors.incompleteData");
          break;
        case 500:
          errorMessage = i18n.t("reservationErrors.serverError");
          break;
        default:
          errorMessage =
            error.message || i18n.t("reservationErrors.creationError");
          break;
      }

      set({
        isCreatingEventReservation: false,
        eventReservationError: errorMessage,
        eventReservationSuccess: false,
      });
    }
  },

  clearErrors: () => {
    set({
      error: null,
      eventReservationError: null,
      reservationsError: null,
    });
  },

  clearSuccess: () => {
    set({
      eventReservationSuccess: false,
    });
  },

  resetStore: () => {
    disconnectReservationsSocket();
    set(initialState);
  },

  connectSocket: () => {
    connectReservationsSocket(
      (reservations: ServerReservation[]) => {
        set({ reservations, isLoadingReservations: false });
      },
      (updatedReservation: ServerReservation) => {
        set((state) => ({
          reservations:
            state.reservations?.map((r) =>
              r.id === updatedReservation.id ? updatedReservation : r
            ) || null,
        }));
      }
    );
  },

  disconnectSocket: () => {
    disconnectReservationsSocket();
  },

  getAllReservationsByUser: async (userId: string) => {
    try {
      set({ isLoadingReservations: true, reservationsError: null });

      // Fallback to HTTP if socket not connected
      const response =
        await reservationService.getAllReservationsByUser(userId);

      if (response.status === 200) {
        set({
          reservations: response.data,
          isLoadingReservations: false,
          reservationsError: null,
        });

        // Connect socket for live updates after initial load
        connectReservationsSocket(
          (reservations: ServerReservation[]) => {
            set({ reservations, isLoadingReservations: false });
          },
          (updatedReservation: ServerReservation) => {
            set((state) => ({
              reservations:
                state.reservations?.map((r) =>
                  r.id === updatedReservation.id ? updatedReservation : r
                ) || null,
            }));
          }
        );
      } else {
        set({
          isLoadingReservations: false,
          reservationsError: "Eroare la încărcarea rezervărilor",
        });
      }
    } catch (error: any) {
      let errorMessage: string = "";

      // Handle different status codes
      switch (error.statusCode) {
        case 401:
          errorMessage = i18n.t("reservationErrors.authRequiredView");
          break;
        case 403:
          errorMessage = i18n.t("reservationErrors.noPermissionView");
          break;
        case 404:
          errorMessage = i18n.t("reservationErrors.notFound");
          break;
        case 500:
          errorMessage = i18n.t("reservationErrors.serverError");
          break;
        default:
          errorMessage =
            error.message || i18n.t("reservationErrors.loadingError");
          break;
      }

      set({
        isLoadingReservations: false,
        reservationsError: errorMessage,
        reservations: [],
      });
    }
  },
}));
