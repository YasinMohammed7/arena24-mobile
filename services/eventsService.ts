import apiClient from "./api";
import { CustomApiError } from "@/types/auth";
import {
  EventCore,
  EventDetailResponseType,
  HomePageEventsResponseType,
  EventDetail,
} from "@/types/events";
import i18n from "@/i18n/config";

class EventsService {
  // Helper method to add base URL to image paths
  private addBaseUrlToImage(imageUrl: string): string {
    if (!imageUrl) return "";
    // If imageUrl already contains the base URL, return as is
    if (imageUrl.startsWith("http")) return imageUrl;
    // Add base URL prefix
    return `${process.env.EXPO_PUBLIC_API_BASE_URL}${imageUrl}`;
  }

  async getEventsHomepage(): Promise<HomePageEventsResponseType> {
    try {
      const response = await apiClient.get("/api/client/events");

      // Process the data to add base URL to image URLs
      const processedData = response.data.map((event: EventCore) => ({
        ...event,
        imageUrl: this.addBaseUrlToImage(event.imageUrl),
      }));

      return { status: response.status, data: processedData };
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        i18n.t("serviceErrors.fetchEventsFailed");
      const statusCode = error.response?.status || 0;
      const errorType =
        error.response?.data?.error ||
        i18n.t("serviceErrors.fetchEventsFailed");
      const details = error.response?.data;

      throw new CustomApiError(message, statusCode, errorType, details);
    }
  }

  async getEventById(id: string): Promise<EventDetailResponseType> {
    try {
      const response = await apiClient.get(`/api/client/event/${id}`);

      // Process the data to add base URL to image URL
      const processedData: EventDetail = {
        ...response.data,
        imageUrl: this.addBaseUrlToImage(response.data.imageUrl),
      };

      return { status: response.status, data: processedData };
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        i18n.t("serviceErrors.fetchEventDetailsFailed");
      const statusCode = error.response?.status || 0;
      const errorType =
        error.response?.data?.error ||
        i18n.t("serviceErrors.fetchEventDetailsFailed");
      const details = error.response?.data;

      throw new CustomApiError(message, statusCode, errorType, details);
    }
  }
}

export default new EventsService();
