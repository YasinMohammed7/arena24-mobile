import * as Maps from "expo-maps";
import { Platform } from "react-native";
import { useEffect, useState } from "react";
import { isHuaweiDevice } from "@/utils/huawei";
import type { PermissionResponse } from "expo-modules-core";

// Map Components
import AppleMap from "@/components/locations/AppleMap";
import GoogleMap from "@/components/locations/GoogleMap";
import HuaweiMap from "@/components/locations/HuaweiMap";

// Permission Components
import PermissionDeniedPermanently from "@/components/permissions/PermissionDeniedPermanently";
import PermissionDenied from "@/components/permissions/PermissionDenied";
import { useLocationsStore } from "@/zustand/locationsStore";
import {
  LocationListItemWithCoordinates,
  LocationDetail,
} from "@/types/locations";

export type MapProps = {
  locations: LocationListItemWithCoordinates[] | LocationDetail | null;
};

export default function Map({ locations }: MapProps) {
  const [isHuawei, setIsHuawei] = useState(false);
  const [locationPermission, setLocationPermission] =
    useState<PermissionResponse | null>(null);
  const [isCheckingPermission, setIsCheckingPermission] = useState(false);

  const isLoading = useLocationsStore((state) => state.isLoading);

  // Convert LocationDetail object to array for GoogleMap and AppleMap
  const locationsAsArray = Array.isArray(locations)
    ? locations
    : locations
    ? [locations]
    : [];

  let formattedLocations: any[] = [];

  if (Array.isArray(locations)) {
    formattedLocations = locations.map(
      (location: LocationListItemWithCoordinates) => ({
        ...location,
        coords: [location.latitude, location.longitude],
      })
    );
  } else if (locations) {
    formattedLocations = [
      {
        ...locations,
        coords: [locations.latitude, locations.longitude],
      },
    ];
  }

  // Check location permission using Maps.getPermissionsAsync()
  const checkLocationPermission =
    async (): Promise<PermissionResponse | void> => {
      try {
        const permission = await Maps.getPermissionsAsync();
        console.log("Permission result:", permission);
        setLocationPermission(permission);
        return permission;
      } catch (error) {
        console.error("Error checking location permission:", error);
      }
    };

  // Request location permission using Maps.requestPermissionsAsync()
  const requestLocationPermission = async (): Promise<void> => {
    try {
      setIsCheckingPermission(true);
      const permission = await Maps.requestPermissionsAsync();
      console.log("Permission request result:", permission);
      setLocationPermission(permission);
    } catch (error) {
      console.error("Error requesting location permission:", error);
    } finally {
      setIsCheckingPermission(false);
    }
  };

  useEffect(() => {
    const initializeApp = async (): Promise<void> => {
      setIsHuawei(isHuaweiDevice());

      // Check permission on component mount for non-Huawei Android devices
      if (!isHuaweiDevice()) {
        const permission = await checkLocationPermission(); // Await the result
        if (permission?.status === "undetermined") {
          await requestLocationPermission();
        }
      }
    };
    initializeApp();
  }, []);
  // Handle permission states for non-Huawei devices

  if (!isHuawei && locationPermission?.status === "denied") {
    return (
      <PermissionDenied
        onRequestPermission={requestLocationPermission}
        isCheckingPermission={isCheckingPermission}
      />
    );
  }
  if (!isHuawei && locationPermission?.canAskAgain === false) {
    return <PermissionDeniedPermanently />;
  }

  // Render appropriate map based on platform
  if (Platform.OS === "ios") {
    return <AppleMap locations={locationsAsArray} isLoading={isLoading} />;
  }

  if (Platform.OS === "android") {
    return isHuawei ? (
      <HuaweiMap geocodedLocations={formattedLocations} isLoading={isLoading} />
    ) : (
      <GoogleMap
        locationPermission={locationPermission}
        geocodedLocations={locationsAsArray}
        isLoading={isLoading}
      />
    );
  }

  if (Platform.OS === "web") {
    return (
      <HuaweiMap geocodedLocations={formattedLocations} isLoading={isLoading} />
    );
  }

  // Fallback for unsupported platforms
  return null;
}
