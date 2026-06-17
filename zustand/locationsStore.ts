import { create } from 'zustand';
import locationsService from '@/services/locationsService';
import { LocationDetail, LocationsStore } from '@/types/locations';
import i18n from '@/i18n/config';

const initialState = {
  locations: [],
  selectedLocation: null,
  selectedLocationId: null,
  isLoading: false,
  isLoadingDetail: false,
  isLoadingDetails: false,
  error: null,
  errorDetail: null,
};

export const useLocationsStore = create<LocationsStore>()((set) => ({
  ...initialState,

  // Actions
  fetchLocations: async () => {
    try {
      set({ isLoading: true, error: null });

      const response = await locationsService.getLocationsHomepage();

      if (response.data.length === 0) {
        set({
          isLoading: false,
          error: i18n.t('locations.noLocations'),
        });
        return;
      }

      if (response.status === 200 && response.data) {
        set({ locations: response.data, isLoading: false, error: null });
      } else {
        set({
          isLoading: false,
          error: i18n.t('locationsErrors.loadingError'),
        });
      }
      // console.log("locations", response.data);
    } catch (error: any) {
      // console.error('Error fetching locations:', error);

      let errorMessage: string = '';

      // Handle different status codes
      switch (error.statusCode) {
        case 401:
          errorMessage = i18n.t('locationsErrors.authRequired');
          break;
        case 403:
          errorMessage = i18n.t('locationsErrors.noPermission');
          break;
        case 404:
          errorMessage = i18n.t('locationsErrors.notFound');
          break;
        case 500:
          errorMessage = i18n.t('locationsErrors.serverError');
          break;
        default:
          errorMessage =
            error.message || i18n.t('locationsErrors.loadingError');
          break;
      }

      set({
        isLoading: false,
        error: errorMessage,
      });
    }
  },

  fetchLocationById: async (id: string) => {
    try {
      // Only clear if it's a different location
      const currentState = useLocationsStore.getState();
      const currentLocation = currentState.selectedLocation;

      // If we already have data for the same location, don't clear it
      if (!currentLocation || currentLocation.id.toString() !== id) {
        set({
          selectedLocation: null,
          isLoadingDetail: true,
          errorDetail: null,
        });
      } else {
        set({ isLoadingDetail: true, errorDetail: null });
      }

      const response = await locationsService.getLocationById(id);
      if (response.status === 200 && response.data) {
        set({
          selectedLocation: response.data,
          isLoadingDetail: false,
          errorDetail: null,
        });
      } else {
        set({ isLoadingDetail: false, error: 'Nu s-a gasit locatia' });
      }
    } catch (error: any) {
      set({
        isLoadingDetail: false,
        errorDetail:
          error.message || 'Eroare la incarcarea detaliilor locatiei',
      });
    }
  },

  fetchLocationDetails: async (id: string) => {
    try {
      // Only clear if it's a different location
      const currentState = useLocationsStore.getState();
      const currentLocation = currentState.selectedLocation;

      // If we already have data for the same location, don't clear it
      if (!currentLocation || currentLocation.id.toString() !== id) {
        set({
          selectedLocation: null,
          isLoadingDetails: true,
          errorDetail: null,
        });
      } else {
        set({ isLoadingDetails: true, error: null });
      }

      const response = await locationsService.getLocationById(id);
      if (response.status === 200 && response.data) {
        set({
          selectedLocation: response.data,
          isLoadingDetails: false,
          errorDetail: null,
        });
      } else {
        set({
          isLoadingDetails: false,
          error: 'Eroare la incarcarea detaliilor locatiei',
        });
      }
    } catch (error: any) {
      set({
        isLoadingDetails: false,
        errorDetail:
          error.message || 'Eroare la incarcarea detaliilor locatiei',
      });
    }
  },

  clearLocations: () => {
    set(initialState);
  },

  setSelectedLocation: (location: LocationDetail) => {
    set({ selectedLocation: location });
  },

  setSelectedLocationId: (id: number | null) => {
    set({ selectedLocationId: id });
  },

  clearSelectedLocation: () => {
    set({ selectedLocation: null, selectedLocationId: null, error: null });
  },
}));
