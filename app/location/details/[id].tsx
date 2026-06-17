import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Share,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocationsStore } from '@/zustand/locationsStore';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import DetailsTab from '@/components/locations/DetailsTab';
import { ArrowLeft, Heart, Share as ShareIcon } from 'lucide-react-native';
import EventTab from '@/components/locations/EventTab';
import GalleryTab from '@/components/locations/GalleryTab';
import { useLanguage } from '@/hooks/useLanguage';
const Tab = createMaterialTopTabNavigator();
export default function LocationDetails() {
  const { t } = useLanguage();
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const {
    selectedLocation: location,
    isLoadingDetails,
    error,
    fetchLocationDetails,
  } = useLocationsStore();

  useEffect(() => {
    if (id) {
      fetchLocationDetails(id);
    }
  }, [id]);

  // Defined components to avoid inline functions
  const DetailsScreen = useMemo(() => {
    return () => <DetailsTab location={location} />;
  }, [location]);

  const EventsScreen = useMemo(() => {
    return () => <EventTab location={location} />;
  }, [location]);

  const GalleryScreen = useMemo(() => {
    return () => <GalleryTab location={location} />;
  }, [location]);

  if (isLoadingDetails) {
    return (
      <SafeAreaView
        edges={['top', 'left', 'right']}
        className='flex-1 bg-white'
      >
        <View className='flex-1 justify-center items-center'>
          <ActivityIndicator size='large' color='#D38B5D' />
          <Text className="text-lg font-['poppins-medium'] text-[#492800] mt-4">
            {t('locations.loadingLocationDetails')}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const onShare = async () => {
    try {
      // Web URL for sharing
      const link = `https://arena-24.expo.app/location/details/${location?.id}`;

      await Share.share({
        message: `${t('locations.shareMessage')} ${link}`,
      });
    } catch (err) {
      console.error('Share failed:', err);
    }
  };

  return (
    <SafeAreaView
      edges={['top', 'left', 'right']}
      className='flex-1 px-5 bg-white'
    >
      {/* Header */}
      <View className='relative justify-center items-center py-4'>
        {/* Back Button - Absolute Left */}
        <TouchableOpacity
          onPress={() => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.push('/');
            }
          }}
          className='absolute left-0 bg-[#49280008] rounded-[30px] p-2 flex-row items-center z-10'
          style={{ backgroundColor: 'rgba(73, 40, 0, 0.05)' }}
        >
          <ArrowLeft size={20} color='#492800' strokeWidth={2} />
        </TouchableOpacity>

        {/* Location Name - Centered */}
        <Text className="text-lg font-['hotel-resort'] text-[#492800] text-center">
          {location?.name || t('locations.locationLabel')}
        </Text>

        {/* Action Icons - Absolute Right */}
        <View className='absolute right-0 flex-row gap-4 z-10'>
          {/* <TouchableOpacity>
            <Heart size={20} color="#492800" strokeWidth={1.5} />
          </TouchableOpacity> */}
          <TouchableOpacity
            onPress={() => {
              onShare();
            }}
          >
            <ShareIcon size={20} color='#492800' strokeWidth={1.5} />
          </TouchableOpacity>
        </View>
      </View>

      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#492800',
          tabBarInactiveTintColor: '#000',
          tabBarLabelStyle: {
            fontSize: 12,
            fontFamily: 'poppins-medium',
            textTransform: 'none',
          },
          tabBarStyle: {
            backgroundColor: 'white',
            elevation: 4,
            shadowOpacity: 0.1,
          },
          tabBarIndicatorStyle: {
            backgroundColor: '#D38B5D',
            height: 3,
          },
        }}
      >
        <Tab.Screen
          name='Details'
          component={DetailsScreen}
          options={{ tabBarLabel: t('locations.details') }}
        />
        <Tab.Screen
          name='Events'
          component={EventsScreen}
          options={{ tabBarLabel: t('locations.events') }}
        />
        <Tab.Screen
          name='Gallery'
          component={GalleryScreen}
          options={{ tabBarLabel: t('locations.gallery') }}
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
}
