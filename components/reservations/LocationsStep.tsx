import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React from 'react';
import { useLocationsStore } from '@/zustand/locationsStore';
import { MapPin } from 'lucide-react-native';
import { useLanguage } from '@/hooks/useLanguage';

export default function LocationsStep() {
  const { t } = useLanguage();
  const isLoading = useLocationsStore((state) => state.isLoading);
  const locations = useLocationsStore((state) => state.locations);
  const selectedLocationId = useLocationsStore(
    (state) => state.selectedLocationId
  );
  const setSelectedLocationId = useLocationsStore(
    (state) => state.setSelectedLocationId
  );

  if (isLoading) {
    return (
      <View className='flex-1 justify-center items-center'>
        <ActivityIndicator size='large' color='#D38B5D' />
      </View>
    );
  }

  if (locations.length === 0) {
    return (
      <View className='flex-1 justify-center items-center'>
        <Text className="font-['poppins-regular'] text-[#492800] text-center">
          {t('reservations.noLocationsAvailable')}
        </Text>
      </View>
    );
  }

  const handleLocationSelect = (locationId: number) => {
    setSelectedLocationId(locationId);
  };

  return (
    <View className='flex-1'>
      <Text className="font-['poppins-medium'] text-lg text-[#492800] text-center mb-6">
        {t('reservations.chooseLocation')}
      </Text>

      <ScrollView className='flex-1' showsVerticalScrollIndicator={false}>
        <View className='flex flex-col gap-4'>
          {locations.map((location) => (
            <TouchableOpacity
              key={location.id}
              onPress={() => handleLocationSelect(location.id)}
              className={`flex flex-row justify-stretch items-stretch gap-6 p-5 rounded-[20px] bg-white ${
                selectedLocationId === location.id
                  ? 'border border-[#D38B5D]'
                  : 'border border-gray-100'
              }`}
            >
              {/* Main Content */}
              <View className='flex-1 flex flex-col justify-center gap-3'>
                {/* Restaurant Info */}
                <View className='flex flex-row items-stretch gap-4'>
                  <View className='flex-1 flex flex-col gap-1'>
                    <Text
                      className="font-['hotel-resort'] text-xl text-[#492800] leading-tight"
                      numberOfLines={1}
                    >
                      {location.name}
                    </Text>
                    <Text className="font-['poppins-medium'] text-xs text-[#D38B5D] leading-tight">
                      {location.experience || t('locations.defaultExperience')}
                    </Text>
                  </View>
                  {/* <View className="justify-start">
                    <Text className="font-['poppins-medium'] text-sm text-[#492800]/70">
                      1.2 km
                    </Text>
                  </View> */}
                </View>

                {/* Address */}
                <View className='flex flex-row items-center gap-2'>
                  <MapPin size={16} color='#492800' strokeWidth={1.5} />
                  <Text
                    className="flex-1 font-['poppins-light'] text-sm text-[#492800]/70 leading-tight"
                    numberOfLines={1}
                  >
                    {location.address}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
