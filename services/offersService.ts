import apiClient from "./api";
import { CustomApiError } from "@/types/auth";
import {
  offersItemCore,
  HomePageOffersResponseType,
  OfferDetailResponseType,
  offersItem,
  OffersCategoriesResponseType,
} from "@/types/offers";
import i18n from "@/i18n/config";

class OffersService {
  // Helper method to add base URL to image paths
  private addBaseUrlToImage(imageUrl: string): string {
    if (!imageUrl) return "";
    // If imageUrl already contains the base URL, return as is
    if (imageUrl.startsWith("http")) return imageUrl;
    // Add base URL prefix
    return `${process.env.EXPO_PUBLIC_API_BASE_URL}${imageUrl}`;
  }

  async getOffersHomepage(): Promise<HomePageOffersResponseType> {
    try {
      const response = await apiClient.get("/api/client/offers");

      // Process the data to add base URL to image URLs
      const processedData = response.data.data.map((offer: offersItemCore) => ({
        ...offer,
        image: this.addBaseUrlToImage(offer.image),
      }));

      return {
        status: response.status,
        data: processedData,
        total: response.data.total,
        page: response.data.page,
        limit: response.data.limit,
        totalPages: response.data.totalPages,
      };
    } catch (error: any) {
      console.log("error", error.response?.data);
      const message =
        error.response?.data?.message ||
        i18n.t("serviceErrors.fetchOffersFailed");
      const statusCode = error.response?.status || 0;
      const errorType =
        error.response?.data?.error ||
        i18n.t("serviceErrors.fetchOffersFailed");
      const details = error.response?.data;

      throw new CustomApiError(message, statusCode, errorType, details);
    }
  }

  async getOfferById(id: string): Promise<OfferDetailResponseType> {
    try {
      const response = await apiClient.get(`/api/client/offer/${id}`);

      // Process the data to add base URL to image URL
      const processedData: offersItem = {
        ...response.data,
        image: this.addBaseUrlToImage(response.data.image),
      };

      return { status: response.status, data: processedData };
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        i18n.t("serviceErrors.fetchOfferDetailsFailed");
      const statusCode = error.response?.status || 0;
      const errorType =
        error.response?.data?.error ||
        i18n.t("serviceErrors.fetchOfferDetailsFailed");
      const details = error.response?.data;

      throw new CustomApiError(message, statusCode, errorType, details);
    }
  }

  async getOffersCategories(): Promise<OffersCategoriesResponseType> {
    try {
      const response = await apiClient.get("/api/client/offer-categories");
      return { status: response.status, data: response.data.data };
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        i18n.t("serviceErrors.fetchOfferCategoriesFailed");
      const statusCode = error.response?.status || 0;
      const errorType =
        error.response?.data?.error ||
        i18n.t("serviceErrors.fetchOfferCategoriesFailed");
      const details = error.response?.data;

      throw new CustomApiError(message, statusCode, errorType, details);
    }
  }
}

export default new OffersService();
