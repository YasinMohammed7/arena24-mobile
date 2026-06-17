import {
  HomePageLocationsResponseType,
  LocationDetailResponseType,
  LocationListItem,
} from '@/types/locations';
import apiClient from './api';
import { CustomApiError } from '@/types/auth';
import i18n from '@/i18n/config';

class LocationsService {
  // Helper method to add base URL to image paths
  private addBaseUrlToImage(imageUrl: string): string {
    if (!imageUrl) return '';
    // If imageUrl already contains the base URL, return as is
    if (imageUrl.startsWith('http')) return imageUrl;
    // Add base URL prefix
    return `${process.env.EXPO_PUBLIC_API_BASE_URL}${imageUrl}`;
  }

  async getLocationsHomepage(): Promise<HomePageLocationsResponseType> {
    try {
      const response = await apiClient.get('/api/client/locations');

      // Process the data to add base URL to image URLs
      const processedData = response.data.map((location: LocationListItem) => ({
        ...location,
        imageUrl: this.addBaseUrlToImage(location.imageUrl),
      }));
      // console.log("processedData", processedData);

      return { status: response.status, data: processedData };
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        i18n.t('serviceErrors.fetchLocationsFailed');
      const statusCode = error.response?.status || 0;
      const errorType =
        error.response?.data?.error ||
        i18n.t('serviceErrors.fetchLocationsFailed');
      const details = error.response?.data;

      throw new CustomApiError(message, statusCode, errorType, details);
    }
  }

  async getLocationById(id: string): Promise<LocationDetailResponseType> {
    try {
      const response = await apiClient.get(`/api/client/location/${id}`);

      // Process the data to add base URL to image URLs
      const processedData = {
        ...response.data,
        imageUrl: this.addBaseUrlToImage(response.data.imageUrl),
        // Process events images as well
        events:
          response.data.events?.map((event: any) => ({
            ...event,
            imageUrl: this.addBaseUrlToImage(event.imageUrl),
          })) || [],
      };

      return { status: response.status, data: processedData };
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        i18n.t('serviceErrors.fetchLocationDetailsFailed');
      const statusCode = error.response?.status || 0;
      const errorType =
        error.response?.data?.error ||
        i18n.t('serviceErrors.fetchLocationDetailsFailed');
      const details = error.response?.data;

      throw new CustomApiError(message, statusCode, errorType, details);
    }
  }
}

export default new LocationsService();
