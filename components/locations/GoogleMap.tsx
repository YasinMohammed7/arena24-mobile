import { GoogleMaps } from 'expo-maps';
import { View, Text } from 'react-native';
import type { GoogleMapProps } from '@/types/mapTypes';
import { LocationListItemWithCoordinates } from '@/types/locations';
import { router } from 'expo-router';
import { useLanguage } from '@/hooks/useLanguage';

//google maps not working
// https://console.cloud.google.com/billing/create?flow=maps&project=gen-lang-client-0303882383&redirectPath=%2Fgoogle%2Fmaps-apis%2Fonboard;step%3Djust_ask%3Fproject%3Dgen-lang-client-0303882383&redirectOnCancel=%2Fgoogle%2Fmaps-apis%2Fdiscover

// Function to calculate distance between two coordinates in kilometers
const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Function to group locations into clusters based on proximity
const clusterLocations = (
  locations: LocationListItemWithCoordinates[],
  maxDistance: number = 20
): LocationListItemWithCoordinates[][] => {
  const clusters: LocationListItemWithCoordinates[][] = [];
  const used = new Set<number>();

  for (let i = 0; i < locations.length; i++) {
    if (used.has(i)) continue;

    const cluster: LocationListItemWithCoordinates[] = [locations[i]];
    used.add(i);

    // Find all locations within maxDistance of the current location
    for (let j = i + 1; j < locations.length; j++) {
      if (used.has(j)) continue;

      const distance = calculateDistance(
        locations[i].latitude,
        locations[i].longitude,
        locations[j].latitude,
        locations[j].longitude
      );

      if (distance <= maxDistance) {
        cluster.push(locations[j]);
        used.add(j);
      }
    }

    clusters.push(cluster);
  }

  return clusters;
};

// Function to calculate camera position based on locations
const calculateCameraPosition = (
  locations: LocationListItemWithCoordinates[]
) => {
  if (locations.length === 0) {
    // Default to Otopeni area
    return {
      coordinates: {
        latitude: 44.5657,
        longitude: 26.0857,
      },
      zoom: 13,
    };
  }

  // If only one location, center on it
  if (locations.length === 1) {
    return {
      coordinates: {
        latitude: locations[0].latitude,
        longitude: locations[0].longitude,
      },
      zoom: 13,
    };
  }

  // Group locations into clusters
  const clusters = clusterLocations(locations);

  // Find the cluster with the most locations
  const largestCluster = clusters.reduce((largest, current) =>
    current.length > largest.length ? current : largest
  );

  // Calculate the center point of the largest cluster
  const latitudes = largestCluster.map((loc) => loc.latitude);
  const longitudes = largestCluster.map((loc) => loc.longitude);

  const centerLat =
    latitudes.reduce((sum, lat) => sum + lat, 0) / latitudes.length;
  const centerLng =
    longitudes.reduce((sum, lng) => sum + lng, 0) / longitudes.length;

  return {
    coordinates: {
      latitude: centerLat,
      longitude: centerLng,
    },
    zoom: 13, // Set zoom to 13 as requested
  };
};

export default function GoogleMap({
  locationPermission,
  geocodedLocations,
  isLoading,
}: GoogleMapProps) {
  const { t } = useLanguage();

  if (isLoading) {
    return (
      <View className='flex-1 justify-center items-center'>
        <Text className='text-lg font-medium'>
          {t('locations.loadingRestaurantLocations')}
        </Text>
      </View>
    );
  }

  const cameraPosition = calculateCameraPosition(
    geocodedLocations as LocationListItemWithCoordinates[]
  );

  return (
    <GoogleMaps.View
      style={{ flex: 1 }}
      cameraPosition={cameraPosition}
      uiSettings={{
        myLocationButtonEnabled: locationPermission?.granted || false,
      }}
      properties={{
        isMyLocationEnabled: locationPermission?.granted || false,
      }}
      markers={
        Array.isArray(geocodedLocations)
          ? geocodedLocations?.map(
              (location: LocationListItemWithCoordinates) => ({
                id: location.id.toString(),
                coordinates: {
                  latitude: location.latitude,
                  longitude: location.longitude,
                },
                title: location.name,
                snippet: location.experience,
              })
            )
          : [
              {
                id: geocodedLocations?.id.toString(),
                coordinates: {
                  latitude: geocodedLocations?.latitude,
                  longitude: geocodedLocations?.longitude,
                },
              },
            ]
      }
      onMarkerClick={(event) => {
        console.log(event.id);
        router.push(`/location/${event.id}`);
      }}
    />
  );
}
