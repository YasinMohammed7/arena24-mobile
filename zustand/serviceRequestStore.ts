import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import telegramService from '@/services/telegramService';
import type { ServiceRequestResult, ServiceRequestParams } from '@/types/modal';
import type {
  ServiceRequestState,
  ServiceRequestRecord,
} from '@/types/telegram';
import { getCurrentLanguage } from '@/i18n/config';
import i18n from '@/i18n/config';

const COOLDOWN_DURATION = 60 * 1000; // 60 seconds
const STORAGE_KEY = 'serviceRequests';

// Timer management for reactive updates
const activeTimers = new Map<string, ReturnType<typeof setTimeout>>();

// Helper function to get current locale
const getLocale = () => {
  const currentLang = getCurrentLanguage();
  const localeMap: Record<string, string> = {
    ro: 'ro-RO',
    en: 'en-US',
    de: 'de-DE',
  };
  return localeMap[currentLang] || 'ro-RO';
};

export const useServiceRequestStore = create<ServiceRequestState>(
  (set, get) => ({
    requests: [],
    lastUpdate: Date.now(),

    triggerUpdate: () => {
      set({ lastUpdate: Date.now() });
    },

    clearAllTimers: () => {
      activeTimers.forEach((timer) => clearTimeout(timer));
      activeTimers.clear();
    },

    addRequest: async (
      locationId: number,
      serviceType: 'waiter' | 'bill' | 'amenity',
      amenityId?: number
    ) => {
      const newRequest: ServiceRequestRecord = {
        locationId,
        serviceType,
        amenityId,
        timestamp: Date.now(),
      };

      set((state) => ({
        requests: [...state.requests, newRequest],
        lastUpdate: Date.now(),
      }));

      // Persist to AsyncStorage
      try {
        const updatedRequests = get().requests;
        await AsyncStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(updatedRequests)
        );
      } catch (error) {
        console.error('Failed to persist service request:', error);
      }

      // Set up timer for reactive update when cooldown expires
      const timerKey = `${locationId}-${serviceType}${
        amenityId ? `-${amenityId}` : ''
      }`;

      // Clear any existing timer for this service
      if (activeTimers.has(timerKey)) {
        clearTimeout(activeTimers.get(timerKey)!);
      }

      // Set new timer to trigger update when cooldown expires
      const timer = setTimeout(() => {
        get().triggerUpdate();
        get().cleanupExpiredRequests();
        activeTimers.delete(timerKey);
      }, COOLDOWN_DURATION + 100); // Small buffer to ensure cleanup

      activeTimers.set(timerKey, timer);
    },

    isInCooldown: (
      locationId: number,
      serviceType: 'waiter' | 'bill' | 'amenity',
      amenityId?: number
    ) => {
      const { requests } = get();
      const now = Date.now();

      const matchingRequest = requests.find(
        (request) =>
          request.locationId === locationId &&
          request.serviceType === serviceType &&
          (serviceType === 'amenity'
            ? request.amenityId === amenityId
            : true) &&
          now - request.timestamp < COOLDOWN_DURATION
      );

      return !!matchingRequest;
    },

    getCooldownRemaining: (
      locationId: number,
      serviceType: 'waiter' | 'bill' | 'amenity',
      amenityId?: number
    ) => {
      const { requests } = get();
      const now = Date.now();

      const matchingRequest = requests.find(
        (request) =>
          request.locationId === locationId &&
          request.serviceType === serviceType &&
          (serviceType === 'amenity' ? request.amenityId === amenityId : true)
      );

      if (!matchingRequest) return 0;

      const elapsed = now - matchingRequest.timestamp;
      const remaining = COOLDOWN_DURATION - elapsed;

      return Math.max(0, remaining);
    },

    cleanupExpiredRequests: async () => {
      const { requests } = get();
      const now = Date.now();

      const activeRequests = requests.filter(
        (request) => now - request.timestamp < COOLDOWN_DURATION
      );

      if (activeRequests.length !== requests.length) {
        set({
          requests: activeRequests,
          lastUpdate: Date.now(),
        });

        // Persist cleaned up requests
        try {
          await AsyncStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(activeRequests)
          );
        } catch (error) {
          console.error('Failed to persist cleaned up requests:', error);
        }
      }
    },

    initializeStore: async () => {
      try {
        const storedRequests = await AsyncStorage.getItem(STORAGE_KEY);
        if (storedRequests) {
          const parsedRequests: ServiceRequestRecord[] =
            JSON.parse(storedRequests);

          // Clean up any expired requests on initialization
          const now = Date.now();
          const activeRequests = parsedRequests.filter(
            (request) => now - request.timestamp < COOLDOWN_DURATION
          );

          set({
            requests: activeRequests,
            lastUpdate: Date.now(),
          });

          // Set up timers for active requests
          activeRequests.forEach((request) => {
            const remaining = COOLDOWN_DURATION - (now - request.timestamp);
            if (remaining > 0) {
              const timerKey = `${request.locationId}-${request.serviceType}${
                request.amenityId ? `-${request.amenityId}` : ''
              }`;

              const timer = setTimeout(() => {
                get().triggerUpdate();
                get().cleanupExpiredRequests();
                activeTimers.delete(timerKey);
              }, remaining + 100); // Small buffer

              activeTimers.set(timerKey, timer);
            }
          });

          // If we cleaned up any requests, update AsyncStorage
          if (activeRequests.length !== parsedRequests.length) {
            await AsyncStorage.setItem(
              STORAGE_KEY,
              JSON.stringify(activeRequests)
            );
          }
        }
      } catch (error) {
        console.error('Failed to initialize service request store:', error);
        set({
          requests: [],
          lastUpdate: Date.now(),
        });
      }
    },

    sendWaiterRequest: async (
      params: ServiceRequestParams
    ): Promise<ServiceRequestResult> => {
      const { locationId, locationName } = params;

      // Check if in cooldown
      if (get().isInCooldown(locationId, 'waiter')) {
        return {
          success: false,
          error: i18n.t('serviceRequests.waiterCooldown'),
        };
      }

      try {
        const waiterRequest = {
          restaurantName: locationName,
          restaurantId: locationId,
          type: 'waiter',
          timestamp: new Date().toLocaleString(getLocale(), {
            timeZone: 'Europe/Bucharest',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
          }),
        };

        const response = await telegramService.sendServiceRequest(
          waiterRequest
        );

        if (response.ok) {
          // Add to cooldown
          await get().addRequest(locationId, 'waiter');

          return {
            success: true,
            message: i18n.t('serviceRequests.waiterSuccess'),
          };
        } else {
          return {
            success: false,
            error: i18n.t('serviceRequests.requestFailed'),
          };
        }
      } catch (error) {
        console.error('Error sending waiter request:', error);
        return {
          success: false,
          error: i18n.t('serviceRequests.unexpectedError'),
        };
      }
    },

    sendBillRequest: async (
      params: ServiceRequestParams
    ): Promise<ServiceRequestResult> => {
      const { locationId, locationName } = params;

      // Check if in cooldown
      if (get().isInCooldown(locationId, 'bill')) {
        return {
          success: false,
          error: i18n.t('serviceRequests.billCooldown'),
        };
      }

      try {
        const billRequest = {
          restaurantName: locationName,
          restaurantId: locationId,
          type: 'bill',
          timestamp: new Date().toLocaleString(getLocale(), {
            timeZone: 'Europe/Bucharest',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
          }),
        };

        const response = await telegramService.sendServiceRequest(billRequest);

        if (response.ok) {
          // Add to cooldown
          await get().addRequest(locationId, 'bill');

          return {
            success: true,
            message: i18n.t('serviceRequests.billSuccess'),
          };
        } else {
          return {
            success: false,
            error: i18n.t('serviceRequests.requestFailed'),
          };
        }
      } catch (error) {
        console.error('Error sending bill request:', error);
        return {
          success: false,
          error: i18n.t('serviceRequests.unexpectedError'),
        };
      }
    },

    sendAmenityRequest: async (
      params: ServiceRequestParams
    ): Promise<ServiceRequestResult> => {
      const {
        locationId,
        locationName,
        amenityId,
        amenityName,
        amenityDescription,
      } = params;

      if (!amenityId || !amenityName || !amenityDescription) {
        return {
          success: false,
          error: i18n.t('serviceRequests.incompleteInfo'),
        };
      }

      // Check if in cooldown
      if (get().isInCooldown(locationId, 'amenity', amenityId)) {
        return {
          success: false,
          error: i18n.t('serviceRequests.amenityCooldown'),
        };
      }

      try {
        const amenityRequest = {
          restaurantName: locationName,
          restaurantId: locationId,
          type: 'amenity',
          timestamp: new Date().toLocaleString(getLocale(), {
            timeZone: 'Europe/Bucharest',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
          }),
          amenityName,
          amenityDescription,
        };

        const response = await telegramService.sendAmenityRequest(
          amenityRequest
        );

        if (response.ok) {
          // Add to cooldown
          await get().addRequest(locationId, 'amenity', amenityId);

          return {
            success: true,
            message: i18n.t('serviceRequests.amenitySuccess'),
          };
        } else {
          return {
            success: false,
            error: i18n.t('serviceRequests.requestFailed'),
          };
        }
      } catch (error) {
        console.error('Error sending amenity request:', error);
        return {
          success: false,
          error: i18n.t('serviceRequests.unexpectedError'),
        };
      }
    },
  })
);
