export type ServiceCardProps = {
  title: string;
  icon: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
};

export type AmenityCardProps = {
  title: string;
  description: string;
  icon: string;
  onPress?: () => void;
  disabled?: boolean;
};

export interface LocationsState {
  locations: LocationListItem[];
  selectedLocation: LocationDetail | null;
  selectedLocationId: number | null;
  isLoading: boolean;
  isLoadingDetail: boolean;
  isLoadingDetails: boolean;
  error: string | null;
  errorDetail: string | null;
}

export interface LocationsActions {
  fetchLocations: () => Promise<void>;
  fetchLocationById: (id: string) => Promise<void>;
  fetchLocationDetails: (id: string) => Promise<void>;
  setSelectedLocationId: (id: number | null) => void;
  setSelectedLocation: (location: LocationDetail) => void;
  clearLocations: () => void;
  clearSelectedLocation: () => void;
}

interface LocationCore {
  id: number;
  name: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Schedule {
  id: number;
  locationId: number;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  createdAt: string;
  updatedAt: string;
}
// Backward compatibility alias
export type ScheduleType = Schedule;

export interface Facility {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  iconUrl: string;
  description: string;
  isActive: boolean;
}
// Backward compatibility alias
export type AmenityType = Facility;

export interface LocationAmenityItem {
  id: number;
  amenityId: number;
  locationId: number;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  amenity: AmenityType;
}
// Backward compatibility alias
export type LocationAmenityType = LocationAmenityItem;

export type Business = {
  id: number;
  name: string;
  description: string | null;
};

export type LocationOffer = {
  id: number;
  name: string;
  description: string;
  image: string;
  startDate: string;
  endDate: string;
  discount: number;
  locationId: number;
  categoryId: number;
  createdAt: string;
  updatedAt: string;
};

export type LocationReview = Record<string, unknown>;

// List/summary representation used on homepage and locations list
export interface LocationListItem extends LocationCore {
  imageUrl: string;
  experience: string;
  address: string;
  contact: string;
  description: string | null;
  latitude: number;
  longitude: number;
  meniuUrl: string;
  type: string;
  capacity: number;
  managersCount: number;
  businessId: number;
  ownerId: string;
  openingHours: string | null;
  amenities: unknown | null;
  schedules: Schedule[];
  locationFacilities: LocationFacility[];
  locationAmenities: LocationAmenityItem[];
  events: LocationEvent[];
  offers: LocationOffer[];
  reviews: LocationReview[];
}

export interface LocationListItemWithCoordinates extends LocationListItem {
  latitude: number;
  longitude: number;
}

// Backward compatibility aliases
export type HomePageLocationsType = LocationListItem;
export type LocationsListType = LocationListItem;

export type LocationEvent = {
  id: number;
  name: string;
  date: string;
  startHour: string;
  endHour: string;
  // maxPeople: number;
  imageUrl: string;
  price: number;
  description?: string;
  address?: string;
  maxPeople?: number;
};

type MediaType = {
  id: string;
  modelType: string;
  type: string;
  fileName: string;
  size: number;
  mimeType: string;
  path: string;
  url: string;
  altText: string;
  sortOrder: number;
  createdAt: string;
};

// Detailed representation used on location detail page
export interface LocationDetail extends LocationCore {
  imageUrl: string;
  experience: string;
  contact: string;
  address: string;
  description: string | null;
  latitude: number;
  longitude: number;
  meniuUrl: string;
  type: string;
  capacity: number;
  managersCount: number;
  businessId: number;
  ownerId: string;
  openingHours: string | null;
  amenities: unknown | null;
  schedules: Schedule[];
  locationFacilities: LocationFacility[];
  locationAmenities: LocationAmenityItem[];
  events: LocationEvent[];
  offers: LocationOffer[];
  reviews: LocationReview[];
  media: MediaType[];
}
// Backward compatibility alias
export type LocationType = LocationDetail;

// Generic API response wrapper
export interface ApiResponse<T> {
  status: number;
  data: T;
}

export type HomePageLocationsResponseType = ApiResponse<LocationListItem[]>;

export type LocationDetailResponseType = ApiResponse<LocationDetail>;

export type LocationFacility = {
  id: number;
  facilityId: number;
  locationId: number;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  facility: {
    id: number;
    name: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  };
};

// Deprecated: kept for compatibility via alias above

export interface LocationsStore extends LocationsState, LocationsActions {}
