import { create } from 'zustand';
import eventsService from '@/services/eventsService';
import { EventsStore } from '@/types/events';
import i18n from '@/i18n/config';

const initialState = {
  events: [],
  isLoading: false,
  error: null,
  eventDetail: null,
  isLoadingDetail: false,
  errorDetail: null,
};

export const useEventsStore = create<EventsStore>()((set) => ({
  ...initialState,

  // Actions
  fetchEvents: async () => {
    try {
      set({ isLoading: true, error: null });

      const response = await eventsService.getEventsHomepage();

      if (response.data.length === 0) {
        set({
          isLoading: false,
          error: i18n.t('eventsErrors.notFound'),
        });
        return;
      }

      if (response.status === 200 && response.data) {
        set({ events: response.data, isLoading: false, error: null });
      } else {
        set({ isLoading: false, error: i18n.t('eventsErrors.loadingError') });
      }
    } catch (error: any) {
      let errorMessage: string = '';

      switch (error.statusCode) {
        case 401:
          errorMessage = i18n.t('eventsErrors.authRequired');
          break;
        case 403:
          errorMessage = i18n.t('eventsErrors.noAccess');
          break;
        case 404:
          errorMessage = i18n.t('eventsErrors.notFound');
          break;
        case 500:
          errorMessage = i18n.t('eventsErrors.serverError');
          break;
        default:
          errorMessage = error.message || i18n.t('eventsErrors.loadingError');
          break;
      }

      set({ isLoading: false, error: errorMessage });
    }
  },
  clearEvents: () => {
    set(initialState);
  },
  fetchEventById: async (id: string) => {
    try {
      set({ isLoadingDetail: true, error: null });
      const response = await eventsService.getEventById(id);
      if (response.status === 200 && response.data) {
        set({
          eventDetail: response.data,
          isLoadingDetail: false,
          error: null,
        });
      } else {
        set({
          isLoadingDetail: false,
          error: i18n.t('eventsErrors.eventLoadingError'),
        });
      }
    } catch (error: any) {
      let errorMessage: string = '';

      switch (error.statusCode) {
        case 401:
          errorMessage = i18n.t('eventsErrors.authRequired');
          break;
        case 403:
          errorMessage = i18n.t('eventsErrors.noAccess');
          break;
        case 404:
          errorMessage = i18n.t('eventsErrors.eventNotFound');
          break;
        case 500:
          errorMessage = i18n.t('eventsErrors.serverError');
          break;
        default:
          errorMessage =
            error.message || i18n.t('eventsErrors.eventLoadingError');
          break;
      }

      set({ isLoadingDetail: false, error: errorMessage });
    }
  },

  clearEventDetail: () => {
    set(initialState);
  },
}));
