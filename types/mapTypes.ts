import { ImageSourcePropType } from "react-native";
import type { PermissionResponse } from "expo-modules-core";
import { LocationListItemWithCoordinates, LocationDetail } from "./locations";


export interface region {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
}

export interface MapApp {
    name: string;
    url: string | null;
}

export interface MapLocation {
    coords?: [number, number]; // [latitude, longitude] - optional, will be filled by geocoding
    address: string; // The actual address to geocode
    title: string;
}

export interface GeocodeResponse {
    results: Array<{
        geometry: {
            location: {
                lat: number;
                lng: number;
            };
        };
        formatted_address: string;
    }>;
    status: string;
}

export interface NominatimGeocodeResponse {
    lat: string;
    lon: string;
    display_name: string;
    place_id: number;
    licence: string;
    osm_type: string;
    osm_id: number;
    importance: number;
    addresstype?: string;
    name?: string;
    address?: {
        house_number?: string;
        road?: string;
        suburb?: string;
        city?: string;
        county?: string;
        state?: string;
        postcode?: string;
        country?: string;
        country_code?: string;
    };
}

export interface GoogleMapProps {
    locationPermission: PermissionResponse | null;
    geocodedLocations: LocationListItemWithCoordinates[] | LocationDetail | null;
    isLoading: boolean;
}

export interface AppleMapProps {
    locations: LocationListItemWithCoordinates[] | LocationDetail | null;
    isLoading: boolean;
}

export interface HuaweiMapProps {
    geocodedLocations: any[];
    isLoading: boolean;
}