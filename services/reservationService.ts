import { reservationEventData } from "@/types/reservations";
import apiClient from "./api";
import { CustomApiError } from "@/types/auth";
import i18n from "@/i18n/config";

class ReservationService {
  async createEventReservation(reservationData: reservationEventData) {
    try {
      const response = await apiClient.post(
        "/api/reservations",
        reservationData
      );
      return { status: response.status, data: response.data };
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        i18n.t("serviceErrors.createEventReservationFailed");
      const statusCode = error.response?.status || 0;
      const errorType =
        error.response?.data?.error ||
        i18n.t("serviceErrors.createEventReservationFailed");
      const details = error.response?.data;

      throw new CustomApiError(message, statusCode, errorType, details);
    }
  }

  async getAllReservationsByUser(userId: string) {
    try {
      const response = await apiClient.get(
        `/api/reservations/by-user/${userId}`
      );
      return { status: response.status, data: response.data };
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        i18n.t("serviceErrors.getAllReservationsFailed");
      const statusCode = error.response?.status || 0;
      const errorType =
        error.response?.data?.error ||
        i18n.t("serviceErrors.getAllReservationsFailed");
      const details = error.response?.data;

      throw new CustomApiError(message, statusCode, errorType, details);
    }
  }
}

const reservationService = new ReservationService();
export default reservationService;
