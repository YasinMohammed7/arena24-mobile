import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Platform,
  Linking,
  Alert,
  ActionSheetIOS,
} from 'react-native';
import { useState, useEffect } from 'react';
import { Copy } from 'lucide-react-native';
import LocationOutline from '@/assets/carouselIcons/location.svg';
import Clock from '@/assets/carouselIcons/clock-brown.svg';
// import Star from "@/assets/carouselIcons/star.svg";
import PhoneIcon from '@/assets/locations-icons/phone.svg';
import GpsIcon from '@/assets/locations-icons/gps.svg';
import { MapApp } from '@/types/mapTypes';
import { Href, useRouter } from 'expo-router';
import { LocationListItem } from '@/types/locations';
import { checkScheduleAndOpenStatus } from '@/utils/scheduleUtils';
import Clipboard from '@react-native-clipboard/clipboard';
import { useLanguage } from '@/hooks/useLanguage';

export default function CardRestaurant({
  id,
  name,
  address,
  schedule,
  experience,
  contact,
  imageUrl,
  isActive,
  LocationFacility,
}: LocationListItem) {
  const router = useRouter();
  const { t } = useLanguage();
  const [isCurrentlyOpen, setIsCurrentlyOpen] = useState(false);
  const [currentSchedule, setCurrentSchedule] = useState<string>('');

  // Function to update schedule and open status
  const updateScheduleStatus = (): void => {
    const { isCurrentlyOpen, currentSchedule } =
      checkScheduleAndOpenStatus(schedule);
    setIsCurrentlyOpen(isCurrentlyOpen);
    setCurrentSchedule(currentSchedule);
  };

  useEffect(() => {
    updateScheduleStatus();
    // Update every minute
    const interval = setInterval(updateScheduleStatus, 60000);
    return () => clearInterval(interval);
  }, [schedule]);

  const copyAddressToClipboard = () => {
    if (address) {
      try {
        Clipboard.setString(address);
        Alert.alert(t('common.success'), t('locations.addressCopied'));
      } catch (error) {
        Alert.alert(
          t('reservations.error'),
          t('locations.couldNotCopyAddress')
        );
      }
    }
  };

  const openMapsApp = async () => {
    if (!address) {
      Alert.alert(t('reservations.error'), t('locations.noAddressAvailable'));
      return;
    }

    try {
      if (Platform.OS === 'ios') {
        // iOS: Create a custom action sheet with map apps
        const query = encodeURIComponent(address);

        const mapOptions: MapApp[] = [
          {
            name: t('locations.openInAppleMaps'),
            url: `http://maps.apple.com/?q=${query}`,
          },
          {
            name: t('locations.openInGoogleMaps'),
            url: `https://maps.google.com/maps?q=${query}`,
          },
          {
            name: t('locations.openInWaze'),
            url: `waze://?q=${query}`,
          },
          {
            name: t('locations.openInUber'),
            url: `https://m.uber.com/ul/?action=setPickup&pickup=my_location&dropoff[formatted_address]=${query}`,
          },
          { name: t('common.cancel'), url: null },
        ];

        // Check which apps are available
        const availableApps: MapApp[] = [];
        for (const app of mapOptions) {
          if (app.url) {
            try {
              const supported = await Linking.canOpenURL(app.url);
              if (supported) {
                availableApps.push(app);
              }
            } catch (error) {
              console.log(`${app.name} not available`);
            }
          } else {
            availableApps.push(app); // Add Cancel option
          }
        }

        if (availableApps.length > 1) {
          ActionSheetIOS.showActionSheetWithOptions(
            {
              options: availableApps.map((app) => app.name),
              cancelButtonIndex: availableApps.length - 1,
              title: name || t('locations.restaurant'),
              message: t('locations.chooseApp'),
            },
            (buttonIndex) => {
              if (buttonIndex < availableApps.length - 1) {
                const selectedApp = availableApps[buttonIndex];
                if (selectedApp.url) {
                  Linking.openURL(selectedApp.url);
                }
              }
            }
          );
        } else {
          // Fallback to generic URL
          const genericUrl = `https://maps.google.com/maps?q=${query}`;
          const supported = await Linking.canOpenURL(genericUrl);
          if (supported) {
            await Linking.openURL(genericUrl);
          }
        }
      } else {
        // Android: Use geo scheme that works well for app chooser
        const androidMapUrl = `geo:0,0?q=${encodeURIComponent(address)}`;

        try {
          const supported = await Linking.canOpenURL(androidMapUrl);
          if (supported) {
            await Linking.openURL(androidMapUrl);
            return;
          }
        } catch (error) {
          console.log('Geo scheme failed, trying alternative');
        }

        // Android fallback
        const fallbackUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          address
        )}`;
        const supported = await Linking.canOpenURL(fallbackUrl);
        if (supported) {
          await Linking.openURL(fallbackUrl);
          return;
        }
      }
    } catch (error) {
      console.error('Error opening map:', error);
      Alert.alert(t('reservations.error'), t('locations.couldNotOpenMapsApp'));
    }
  };

  return (
    <TouchableOpacity
      onPress={() => {
        id && router.push(`/location/${id}` as Href);
      }}
      className={`bg-white mb-5 border border-[#F1F1F1] rounded-[10px] w-full ${
        Platform.OS === 'android' ? 'shadow-md' : ''
      }`}
    >
      {/* Restaurant Image + Rating Badge */}
      <View className='relative mb-4'>
        <Image
          source={{ uri: imageUrl ?? '' }}
          className='w-full h-48 rounded-t-[10px]'
          resizeMode='cover'
        />
        {/* <View className="absolute right-3 top-3 bg-[rgba(255,248,231,0.16)] border border-[rgba(255,255,255,0.27)] rounded-[23px] px-3 py-1.5 flex-row items-center gap-1">
          <Star width={12} height={12} color="#fff" />
          <Text className="text-white font-['Montserrat-SemiBold'] text-sm">
            {rating}
          </Text>
        </View> */}
      </View>

      {/* Restaurant Name */}
      <Text className="font-['hotelResort'] text-xl font-bold text-[#492800] mb-1 ml-5">
        {name}
      </Text>

      {/* Category + Distance */}
      <View className='flex-row items-center justify-between mb-3 ml-5 mr-5'>
        <Text className="font-['poppins-light'] text-sm text-[rgba(73,40,0,0.7)]">
          {experience}
        </Text>
        {/* <Text className="font-['poppins-medium'] text-sm text-[#492800]">
          {distance}
        </Text> */}
      </View>

      {/* Address Row */}
      <View className='flex-row items-center justify-between mb-2 ml-5 mr-5'>
        <View className='flex-row items-center gap-2 flex-1'>
          <LocationOutline width={16} height={16} />
          <Text className="font-['poppins-light'] text-sm text-[rgba(73,40,0,0.7)] flex-1">
            {address}
          </Text>
        </View>
        <TouchableOpacity onPress={copyAddressToClipboard} className='p-1'>
          <Copy size={16} color='rgba(73,40,0,0.7)' />
        </TouchableOpacity>
      </View>

      {/* Hours Row */}
      <View className='flex-row items-center gap-2 mb-2 ml-5'>
        <Clock width={16} height={16} />
        <Text className="font-['poppins-light'] text-sm text-[rgba(73,40,0,0.7)]">
          {t('locations.openSchedule', { schedule: currentSchedule })}
        </Text>
      </View>

      {/* Phone Row */}
      <View className='flex-row items-center gap-2 mb-3 ml-5'>
        <PhoneIcon width={16} height={16} />
        <Text className="font-['poppins-light'] text-sm text-[rgba(73,40,0,0.7)]">
          {contact}
        </Text>
      </View>

      {/* Tags */}
      <View className='flex-row flex-wrap gap-2 mb-4 ml-5 mr-5'>
        {LocationFacility?.map((tag, index) => (
          <View key={index} className='bg-[#D38B5D36] rounded-full px-3 py-1'>
            <Text className="font-['poppins-medium'] text-xs text-[#99621E]">
              {tag.facility.name}
            </Text>
          </View>
        ))}
      </View>

      {/* Buttons */}
      <View className='flex-row gap-3 m-4'>
        <TouchableOpacity
          className='flex-1 bg-transparent border border-[#EEEEEE] rounded-full py-3 items-center flex-row gap-2 justify-center'
          onPress={openMapsApp}
        >
          <GpsIcon width={16} height={16} />
          <Text className="text-[#99621E] font-['poppins-medium'] text-lg">
            {t('locations.location')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            id && router.push(`/location/${id}` as Href);
          }}
          className='flex-1 bg-[#D38B5D] rounded-full py-3 items-center'
        >
          <Text className="text-white font-['poppins-medium'] text-lg">
            {t('locations.choose')}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}
