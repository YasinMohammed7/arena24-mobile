import {
  Alert,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { LocationDetail } from '@/types/locations';
import Map from './Map';
import { Copy, Phone, Calendar, Info, Home } from 'lucide-react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import LocationOutline from '@/assets/carouselIcons/location.svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLanguage } from '@/hooks/useLanguage';

interface DetailsTabProps {
  location: LocationDetail | null;
}

export default function DetailsTab({ location }: DetailsTabProps) {
  const { t } = useLanguage();
  const copyAddressToClipboard = () => {
    if (location?.address) {
      try {
        Clipboard.setString(location?.address);
        Alert.alert(t('reservations.success'), t('locations.addressCopied'));
      } catch (error) {
        Alert.alert(t('reservations.error'), t('locations.addressCopyError'));
      }
    }
  };
  return (
    <SafeAreaView edges={['left', 'right']} className='flex-1 bg-white py-6'>
      <ScrollView className='flex-1 bg-white'>
        <View className='h-40'>
          <Map locations={location} />
        </View>

        <View className='flex-row items-center justify-between mt-4'>
          <View className='flex-row items-center gap-2 flex-1 pr-5'>
            <LocationOutline />
            <Text className="font-['poppins-light'] text-sm text-[rgba(73,40,0,0.7)]">
              {location?.address}
            </Text>
          </View>
          <TouchableOpacity onPress={copyAddressToClipboard} className='p-1'>
            <Copy size={16} color='rgba(73,40,0,0.7)' />
          </TouchableOpacity>
        </View>

        {/* Telefon Section */}
        <View className='flex-row gap-2 mt-5'>
          <View className='mt-0.7'>
            <Phone size={16} color='#492800' />
          </View>
          <View className='flex-col justify-center'>
            <Text className="font-['poppins-medium'] text-sm text-[#492800]">
              {t('locations.phone')}
            </Text>
            <Text className="font-['poppins-light'] text-sm text-[rgba(73,40,0,0.7)]">
              {location?.contact || ''}
            </Text>
          </View>
        </View>

        {/* Program Section */}
        <View className='flex-row items-start gap-2 mt-5'>
          <View className='mt-0.7'>
            <Calendar size={16} color='#492800' />
          </View>
          <View className='flex-col justify-center gap-1'>
            <Text className="font-['poppins-medium'] text-sm text-[#492800]">
              {t('locations.schedule')}
            </Text>
            {location?.schedule && location.schedule.length > 0 ? (
              location.schedule.map((scheduleItem, index) => (
                <Text
                  key={index}
                  className="font-['poppins-light'] text-sm text-[rgba(73,40,0,0.7)]"
                >
                  {scheduleItem.dayOfWeek}: {scheduleItem.startTime} -{' '}
                  {scheduleItem.endTime}
                </Text>
              ))
            ) : (
              <>
                <Text className="font-['poppins-light'] text-sm text-[rgba(73,40,0,0.7)]">
                  {t('locations.defaultScheduleMF')}
                </Text>
                <Text className="font-['poppins-light'] text-sm text-[rgba(73,40,0,0.7)]">
                  {t('locations.defaultScheduleSat')}
                </Text>
                <Text className="font-['poppins-light'] text-sm text-[rgba(73,40,0,0.7)]">
                  {t('locations.defaultScheduleSun')}
                </Text>
              </>
            )}
          </View>
        </View>

        {/* Facilitati Section */}
        <View className='flex-row items-start gap-2 mt-5 flex-1'>
          <View className='mt-0.7'>
            <Home size={16} color='#492800' />
          </View>
          <View className='flex-col justify-center gap-1 flex-1'>
            <Text className="font-['poppins-medium'] text-sm text-[#492800]">
              {t('locations.facilities')}
            </Text>
            <View className='flex-row flex-wrap gap-2'>
              {location?.LocationFacility &&
              location.LocationFacility.length > 0 ? (
                location.LocationFacility.map((facility, index) => (
                  <View
                    key={index}
                    className='bg-[rgba(211,139,93,0.15)] px-3 py-1 rounded-full'
                  >
                    <Text className="font-['poppins-medium'] text-xs text-[#925407]">
                      {facility.facility.name}
                    </Text>
                  </View>
                ))
              ) : (
                <>
                  <View className='bg-[rgba(211,139,93,0.15)] px-3 py-1 rounded-full'>
                    <Text className="font-['poppins-medium'] text-xs text-[#925407]">
                      {t('locations.terrace')}
                    </Text>
                  </View>
                  <View className='bg-[rgba(211,139,93,0.15)] px-3 py-1 rounded-full'>
                    <Text className="font-['poppins-medium'] text-xs text-[#925407]">
                      {t('locations.parking')}
                    </Text>
                  </View>
                  <View className='bg-[rgba(211,139,93,0.15)] px-3 py-1 rounded-full'>
                    <Text className="font-['poppins-medium'] text-xs text-[#925407]">
                      {t('locations.liveMusic')}
                    </Text>
                  </View>
                  <View className='bg-[rgba(211,139,93,0.15)] px-3 py-1 rounded-full'>
                    <Text className="font-['poppins-medium'] text-xs text-[#925407]">
                      {t('locations.privateDining')}
                    </Text>
                  </View>
                  <View className='bg-[rgba(211,139,93,0.15)] px-3 py-1 rounded-full'>
                    <Text className="font-['poppins-medium'] text-xs text-[#925407]">
                      {t('locations.veganDishes')}
                    </Text>
                  </View>
                </>
              )}
            </View>
          </View>
        </View>

        {/* Despre Restaurant Section */}
        <View className='flex-row items-start gap-2 mt-5 mb-6'>
          <View className='mt-0.7'>
            <Info size={16} color='#492800' />
          </View>
          <View className='flex-col justify-center gap-1 flex-1'>
            <Text className="font-['poppins-medium'] text-sm text-[#492800]">
              {t('locations.aboutRestaurant')}
            </Text>
            <Text className="font-['poppins-light'] text-sm text-[rgba(73,40,0,0.7)] leading-6">
              {location?.description ||
                'Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas.'}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
