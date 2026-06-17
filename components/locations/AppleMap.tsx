import { View, Text } from 'react-native';
import { AppleMaps } from 'expo-maps';
import type { AppleMapProps } from '@/types/mapTypes';
import type { LocationListItemWithCoordinates } from '@/types/locations';
import { router } from 'expo-router';
import { useLanguage } from '@/hooks/useLanguage';

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
    zoom: 12.5, // Set zoom to 13 as requested
  };
};

export default function AppleMap({ locations, isLoading }: AppleMapProps) {
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

  // Filter locations that have valid coordinates
  const validLocations = Array.isArray(locations)
    ? locations.filter(
        (location: LocationListItemWithCoordinates) =>
          location.latitude !== undefined &&
          location.longitude !== undefined &&
          !isNaN(location.latitude) &&
          !isNaN(location.longitude)
      )
    : [];

  const cameraPosition = calculateCameraPosition(validLocations);

  return (
    <AppleMaps.View
      cameraPosition={cameraPosition}
      style={{ flex: 1 }}
      markers={validLocations.map((location) => ({
        id: `${location.id}`,
        coordinates: {
          latitude: location.latitude,
          longitude: location.longitude,
        },
        title: location.name,
        snippet: `${location.experience}\n${location.address}`,
      }))}
      onMarkerClick={(event) => {
        router.push(`/location/${event.id}`);
      }}
    />
  );
}
