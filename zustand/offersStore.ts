import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import offersService from '@/services/offersService';
import { OffersStore } from '@/types/offers';
import i18n from '@/i18n/config';

const initialState = {
  offers: [],
  isLoading: false,
  error: null,
  offerDetail: null,
  isLoadingDetail: false,
  errorDetail: null,
  offersCategories: [],
  isLoadingCategories: false,
  errorCategories: null,
};

export const useOffersStore = create<OffersStore>()((set) => ({
  ...initialState,

  // Actions
  fetchOffers: async () => {
    try {
      set({ isLoading: true, error: null });

      // api/client/offers doesn't require authentication
      const response = await offersService.getOffersHomepage();

      if (response.data.length === 0) {
        set({
          isLoading: false,
          error: i18n.t('offersErrors.notFound'),
        });
        return;
      }

      if (response.status === 200 && response.data) {
        set({ offers: response.data, isLoading: false, error: null });
      } else {
        set({ isLoading: false, error: i18n.t('offersErrors.loadingError') });
      }
    } catch (error: any) {
      let errorMessage: string = '';

      switch (error.statusCode) {
        case 401:
          errorMessage = i18n.t('offersErrors.authRequired');
          break;
        case 403:
          errorMessage = i18n.t('offersErrors.noAccess');
          break;
        case 404:
          errorMessage = i18n.t('offersErrors.notFound');
          break;
        case 500:
          errorMessage = i18n.t('offersErrors.serverError');
          break;
        default:
          errorMessage = error.message || i18n.t('offersErrors.loadingError');
          break;
      }

      set({ isLoading: false, error: errorMessage });
    }
  },
  clearOffers: () => {
    set(initialState);
  },
  fetchOfferById: async (id: string) => {
    try {
      set({ isLoadingDetail: true, errorDetail: null });
      const response = await offersService.getOfferById(id);
      if (response.status === 200 && response.data) {
        set({
          offerDetail: response.data,
          isLoadingDetail: false,
          errorDetail: null,
        });
      } else {
        set({
          isLoadingDetail: false,
          errorDetail: i18n.t('offersErrors.offerLoadingError'),
        });
      }
    } catch (error: any) {
      let errorMessage: string = '';

      switch (error.statusCode) {
        case 401:
          errorMessage = i18n.t('offersErrors.authRequired');
          break;
        case 403:
          errorMessage = i18n.t('offersErrors.noAccess');
          break;
        case 404:
          errorMessage = i18n.t('offersErrors.offerNotFound');
          break;
        case 500:
          errorMessage = i18n.t('offersErrors.serverError');
          break;
        default:
          errorMessage =
            error.message || i18n.t('offersErrors.offerLoadingError');
          break;
      }

      set({ isLoadingDetail: false, errorDetail: errorMessage });
    }
  },

  clearOfferDetail: () => {
    set({ offerDetail: null, isLoadingDetail: false, errorDetail: null });
  },

  fetchOffersCategories: async () => {
    try {
      set({ isLoadingCategories: true, errorCategories: null });

      const response = await offersService.getOffersCategories();

      if (response.data.length === 0) {
        set({
          isLoadingCategories: false,
          errorCategories: i18n.t('offersErrors.categoriesNotFound'),
        });
        return;
      }
      if (response.status === 200 && response.data) {
        set({
          offersCategories: response.data,
          isLoadingCategories: false,
          errorCategories: null,
        });
      } else {
        set({
          isLoadingCategories: false,
          errorCategories: i18n.t('offersErrors.categoriesLoadingError'),
        });
      }
    } catch (error: any) {
      let errorMessage: string = '';
      switch (error.statusCode) {
        case 401:
          errorMessage = i18n.t('offersErrors.authRequired');
          break;
        case 403:
          errorMessage = i18n.t('offersErrors.noAccess');
          break;
        case 404:
          errorMessage = i18n.t('offersErrors.categoriesNotFound');
          break;
        case 500:
          errorMessage = i18n.t('offersErrors.serverError');
          break;
        default:
          errorMessage =
            error.message || i18n.t('offersErrors.categoriesLoadingError');
          break;
      }
      set({ isLoadingCategories: false, errorCategories: errorMessage });
    }
  },
  clearOffersCategories: () => {
    set({
      offersCategories: [],
      isLoadingCategories: false,
      errorCategories: null,
    });
  },
}));
