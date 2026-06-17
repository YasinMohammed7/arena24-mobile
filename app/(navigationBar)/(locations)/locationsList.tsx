import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import CardRestaurant from '@/components/locations/CardRestaurant';
import { LocationListItem } from '@/types/locations';
import { useLocationsStore } from '@/zustand/locationsStore';
import { useRefresh } from '@/hooks/useRefresh';
import { useLanguage } from '@/hooks/useLanguage';

const renderRestaurant = ({ item }: { item: LocationListItem }) => (
  <CardRestaurant
    id={item.id}
    name={item.name}
    address={item.address}
    schedule={item.schedule}
    experience={item.experience}
    contact={item.contact}
    imageUrl={item.imageUrl}
    isActive={item.isActive}
    LocationFacility={item.LocationFacility}
  />
);

const LocationsList = () => {
  const { locations, isLoading, fetchLocations } = useLocationsStore();
  const { t } = useLanguage();

  // Pull-to-refresh functionality
  const { refreshing, onRefresh } = useRefresh({
    onRefresh: fetchLocations,
  });

  // Show loading state
  if (isLoading) {
    return (
      <View className='flex-1 justify-center items-center'>
        <ActivityIndicator size='large' color='#D38B5D' />
        <Text className="text-lg font-['poppins-medium'] text-[#492800] mt-4">
          {t('locations.loadingLocations')}
        </Text>
      </View>
    );
  }

  // Show message when no locations available
  if (locations.length === 0) {
    return (
      <View className='flex-1 justify-center items-center'>
        <Text className="text-lg font-['poppins-medium'] text-[#492800]">
          {t('locations.noLocations')}
        </Text>
      </View>
    );
  }
  return (
    <View className='flex-1'>
      <FlatList
        data={locations}
        renderItem={renderRestaurant}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        refreshing={refreshing}
        onRefresh={onRefresh}
      />
    </View>
  );
};

export default LocationsList;
