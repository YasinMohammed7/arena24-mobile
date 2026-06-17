import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface CacheState {
    cache: Record<string, string>;
    getCached: (key: string) => Promise<string | null>;
    setCachedPersistent: (key: string, value: string, ttlMs?: number) => Promise<void>;
    clearCache: () => void;
}

export const useCacheStore = create<CacheState>((set, get) => ({
    cache: {},

    getCached: async (key: string): Promise<string | null> => {
        try {
            // First check in-memory cache
            const { cache } = get();
            let storedData = cache[key];

            // If not in memory, check AsyncStorage
            if (!storedData) {
                const asyncStorageData = await AsyncStorage.getItem(key);
                if (asyncStorageData) {
                    storedData = asyncStorageData;
                }
            }

            if (storedData) {
                try {
                    const parsedData = JSON.parse(storedData);

                    // Check if data has expiration and if it's expired
                    if (parsedData.ttl && parsedData.timestamp) {
                        const isExpired = Date.now() - parsedData.timestamp > parsedData.ttl;
                        if (isExpired) {
                            // Remove expired data
                            set((state) => {
                                const newCache = { ...state.cache };
                                delete newCache[key];
                                return { cache: newCache };
                            });
                            await AsyncStorage.removeItem(key);
                            return null;
                        }
                    }

                    // Update in-memory cache if it wasn't there
                    if (!cache[key]) {
                        set((state) => ({
                            cache: { ...state.cache, [key]: storedData }
                        }));
                    }

                    return parsedData.value || parsedData; // Return value if new format, otherwise return as-is for backward compatibility
                } catch (parseError) {
                    // Handle old format data (plain strings)
                    return storedData;
                }
            }

            return null;
        } catch (error) {
            console.error('Error getting cached value:', error);
            return null;
        }
    },

    setCachedPersistent: async (key: string, value: string, ttlMs?: number): Promise<void> => {
        try {
            const cacheData = {
                value,
                timestamp: Date.now(),
                ttl: ttlMs
            };

            const serializedData = JSON.stringify(cacheData);

            // Update in-memory cache
            set((state) => ({
                cache: { ...state.cache, [key]: serializedData }
            }));

            // Store in AsyncStorage for persistence
            await AsyncStorage.setItem(key, serializedData);
        } catch (error) {
            console.error('Error setting cached value:', error);
        }
    },

    clearCache: () => {
        set({ cache: {} });
        AsyncStorage.clear();
    },
})); 