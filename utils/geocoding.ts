import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { MapLocation, NominatimGeocodeResponse } from "@/types/mapTypes";
import type { LocationProps } from "@/types/homepage";
import { LocationListItem } from "@/types/locations";

const NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org/search";
const GEOCODE_CACHE_KEY = "geocode_cache";
const CACHE_EXPIRY_HOURS = 24 * 7; // Cache for 1 week

/**
 * Get cached coordinates for an address
 */
async function getCachedCoordinates(address: string): Promise<[number, number] | null> {
    try {
        const cacheData = await AsyncStorage.getItem(GEOCODE_CACHE_KEY);
        if (cacheData) {
            const cache = JSON.parse(cacheData);
            const entry = cache[address];
            if (entry) {
                const { coords, timestamp } = entry;
                const now = Date.now();
                const expiryTime = timestamp + (CACHE_EXPIRY_HOURS * 60 * 60 * 1000);

                if (now < expiryTime) {
                    return coords;
                }
            }
        }
    } catch (error) {
        console.warn("Error reading geocode cache:", error);
    }
    return null;
}

/**
 * Cache coordinates for an address
 */
async function cacheCoordinates(address: string, coords: [number, number]): Promise<void> {
    try {
        const cacheData = await AsyncStorage.getItem(GEOCODE_CACHE_KEY);
        const cache = cacheData ? JSON.parse(cacheData) : {};

        cache[address] = {
            coords,
            timestamp: Date.now()
        };

        await AsyncStorage.setItem(GEOCODE_CACHE_KEY, JSON.stringify(cache));
    } catch (error) {
        console.warn("Error caching geocode result:", error);
    }
}

/**
 * Clean address by removing postal codes for better geocoding accuracy
 */
function cleanAddressForGeocoding(address: string): string {
    // Remove Romanian postal codes (6 digits) from the end of the address
    // Also remove common postal code patterns like "123456" or "12-3456"
    const postalCodePattern = /,?\s*\d{2}[-\s]?\d{4}\s*$/;
    const cleaned = address.replace(postalCodePattern, '').trim();

    // Remove trailing comma if present
    return cleaned.replace(/,\s*$/, '').trim();
}

/**
 * Geocode an address to get coordinates using OpenStreetMap Nominatim API
 */
export async function geocodeAddress(address: string): Promise<[number, number] | null> {
    // Clean the address before geocoding
    const cleanedAddress = cleanAddressForGeocoding(address);

    // Check cache first
    const cachedCoords = await getCachedCoordinates(cleanedAddress);
    if (cachedCoords) {
        console.log(`Using cached coordinates for: ${cleanedAddress}`);
        return cachedCoords;
    }

    try {
        const encodedAddress = encodeURIComponent(cleanedAddress);
        console.log(`Geocoding address with Nominatim: ${cleanedAddress} (original: ${address})`);

        const response = await axios.get<NominatimGeocodeResponse[]>(NOMINATIM_BASE_URL, {
            params: {
                q: encodedAddress,
                format: 'json',
                limit: 1,
                countrycodes: 'ro', // Restrict to Romania for better results
                addressdetails: 1,
            },
            headers: {
                'User-Agent': 'Arena24Mobile/1.0', // Required by Nominatim API
            }
        });

        const data = response.data;
        console.log("data", data);

        if (data?.length > 0) {
            const location = data[0];
            const coords: [number, number] = [parseFloat(location.lat), parseFloat(location.lon)];

            // Cache the result
            await cacheCoordinates(cleanedAddress, coords);

            console.log(`Geocoded address: ${cleanedAddress} -> ${coords[0]}, ${coords[1]}`);
            return coords;
        } else {
            console.warn(`Geocoding failed for address: ${cleanedAddress} - No results found`);
            return null;
        }
    } catch (error) {
        console.error("Error geocoding address:", error);
        return null;
    }
}

/**
 * Convert restaurants to map locations format with cached coordinates
 * This is the main function you need - it handles everything internally
 */
export async function restaurantsToMapLocations(restaurants: LocationListItem[]): Promise<any[]> {
    const mapLocations: any[] = [];

    for (const restaurant of restaurants) {
        if (!restaurant.address) {
            console.warn("Restaurant missing address:", restaurant.name);
            continue;
        }

        // Get coordinates (from cache or geocode)
        const coords = await geocodeAddress(restaurant.address);

        if (coords) {
            mapLocations.push({
                address: restaurant.address,
                name: restaurant.name || "Restaurant",
                experience: restaurant.experience,
                coords
            });
        }
    }

    return mapLocations;
}

/**
 * Fallback coordinates for Otopeni area (in case geocoding fails)
 */
export const OTOPENI_FALLBACK_COORDS: [number, number] = [44.5657, 26.0857];