import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Share,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { useLocalSearchParams, useRouter, Href } from 'expo-router';
import {
  ArrowLeft,
  MessageSquareShare,
  MapPin,
  Calendar,
  Clock,
  Users,
  ArrowRight,
  CheckCircle,
  Square,
} from 'lucide-react-native';
import { useEffect } from 'react';
import { useEventsStore } from '@/zustand/eventsStore';
import { useLocationsStore } from '@/zustand/locationsStore';
import { useAuthStore } from '@/zustand/authStore';
import * as Linking from 'expo-linking';
import { useLanguage } from '@/hooks/useLanguage';

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { t, getLocale } = useLanguage();

  const fetchEventById = useEventsStore((state) => state.fetchEventById);
  const event = useEventsStore((state) => state.eventDetail);
  const isLoadingDetail = useEventsStore((state) => state.isLoadingDetail);
  const errorDetail = useEventsStore((state) => state.errorDetail);

  const fetchLocationById = useLocationsStore(
    (state) => state.fetchLocationById
  );
  const selectedLocation = useLocationsStore((state) => state.selectedLocation);

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const setRedirectAfterLogin = useAuthStore(
    (state) => state.setRedirectAfterLogin
  );

  useEffect(() => {
    fetchEventById(id);
  }, [id]);

  useEffect(() => {
    if (event?.location?.id) {
      fetchLocationById(event.location.id.toString());
    }
  }, [event?.location?.id]);

  // Show loading state
  if (isLoadingDetail) {
    return (
      <SafeAreaView className='flex-1 bg-white'>
        <View className='flex-1 justify-center items-center px-5'>
          <Text className="text-lg font-['poppins-medium'] text-[#492800]">
            {t('events.loadingEvent')}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Show error state
  if (errorDetail) {
    return (
      <SafeAreaView className='flex-1 bg-white'>
        <View className='flex-1 justify-center items-center px-5'>
          <Text className='text-xl font-bold text-[#492800] mb-4'>
            {errorDetail}
          </Text>
          <TouchableOpacity
            className='bg-[#D38B5D] rounded-full px-6 py-3'
            onPress={() => router.back() ?? router.replace('/')}
          >
            <Text className="text-white font-['poppins-medium'] text-lg">
              {t('common.back')}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // If event not found, show error
  if (!event) {
    return (
      <SafeAreaView className='flex-1 bg-white'>
        <View className='flex-1 justify-center items-center px-5'>
          <Text className='text-xl font-bold text-[#492800] mb-4'>
            {t('events.eventNotFound')}
          </Text>
          <TouchableOpacity
            className='bg-[#D38B5D] rounded-full px-6 py-3'
            onPress={() => router.back() ?? router.replace('/')}
          >
            <Text className="text-white font-['poppins-medium'] text-lg">
              {t('common.back')}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const onShare = async () => {
    try {
      // Web URL for sharing
      const link = `https://arena-24.expo.app/events/${event.id}`;

      await Share.share({
        message: `${t('events.shareMessage')} ${link}`,
      });
    } catch (err) {
      console.error('Share failed:', err);
    }
  };

  const locale = getLocale();

  const formattedDate = new Date(event.date).toLocaleDateString(locale, {
    day: '2-digit',
    month: 'long',
  });
  const formattedStartHour = new Date(event.startHour).toLocaleTimeString(
    locale,
    {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'UTC',
    }
  );
  const formattedEndHour = new Date(event.endHour).toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'UTC',
  });

  return (
    <SafeAreaView className='flex-1 bg-white'>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Event Image */}
        <View className='relative'>
          <Image
            source={{ uri: event.imageUrl }}
            className='w-full h-44'
            resizeMode='cover'
          />

          {/* Header Overlay */}
          <View className='absolute top-0 left-0 right-0 flex-row justify-between items-center px-5 pt-2'>
            {/* Back Arrow - Flex Start */}
            <TouchableOpacity
              onPress={() => router.back() ?? router.replace('/')}
            >
              <BlurView
                intensity={9.4}
                tint='light'
                className='rounded-[30px] bg-[rgba(255,255,255,0.01)]'
                style={{
                  padding: 8,
                  overflow: 'hidden',
                }}
              >
                <ArrowLeft size={20} color='#FFFFFF' />
              </BlurView>
            </TouchableOpacity>

            {/* Title - Center */}
            <Text className="font-['hotel-resort'] text-xl text-white flex-1 text-center">
              {t('events.details')}
            </Text>

            {/* Share Icon - Flex End */}
            <TouchableOpacity
              onPress={() => {
                onShare();
              }}
              className='p-2'
            >
              <MessageSquareShare size={24} color='#FFFFFF' />
            </TouchableOpacity>
          </View>

          {/* Bottom Left Event Info */}
          <View className='absolute bottom-0 left-0 right-0 flex-col justify-end px-5 pb-4'>
            {/* Event Title */}
            <Text className="font-['hotel-resort'] text-xl text-white">
              {event.name}
            </Text>

            {/* Location with Icon */}
            <View className='flex-row items-center gap-1'>
              <MapPin size={12} color='#FFFFFF' strokeWidth={1.5} />
              <Text className="font-['poppins-medium'] text-xs text-white">
                {event.location.name}
              </Text>
            </View>
          </View>
        </View>

        {/* Event Content */}
        <View className='px-4 py-6'>
          {/* Event Details Card */}
          <View
            className='bg-white border border-[#F1F1F1] rounded-[10px] p-5 mb-6'
            style={{
              shadowColor: 'rgba(20, 12, 3, 0.32)',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 1,
              shadowRadius: 11.1,
              elevation: 5,
            }}
          >
            {/* Grid Layout */}
            <View className='flex-row justify-center gap-10'>
              {/* Left Column */}
              <View className='flex-col gap-5 flex-1'>
                {/* Date */}
                <View className='flex-row gap-2 items-start'>
                  <Calendar size={16} color='#492800' strokeWidth={1.5} />
                  <View className='flex-col gap-2'>
                    <Text className="font-['poppins-medium'] text-xs text-[rgba(73,40,0,0.7)]">
                      {t('events.date')}
                    </Text>
                    <Text className="font-['poppins-light'] text-sm text-[rgba(73,40,0,0.7)]">
                      {formattedDate}
                    </Text>
                  </View>
                </View>

                {/* Location */}
                <View className='flex-row gap-2 items-start'>
                  <MapPin size={16} color='#492800' strokeWidth={1.5} />
                  <View className='flex-col gap-2'>
                    <Text className="font-['poppins-medium'] text-xs text-[rgba(73,40,0,0.7)]">
                      {t('events.address')}
                    </Text>
                    <Text className="font-['poppins-light'] text-sm text-[rgba(73,40,0,0.7)]">
                      {event.location.address}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Right Column */}
              <View className='flex-col gap-5 flex-1'>
                {/* Time */}
                <View className='flex-row gap-2 items-start'>
                  <Clock size={16} color='#492800' strokeWidth={1.5} />
                  <View className='flex-col gap-2'>
                    <Text className="font-['poppins-medium'] text-xs text-[rgba(73,40,0,0.7)]">
                      {t('events.time')}
                    </Text>
                    <Text className="font-['poppins-light'] text-sm text-[rgba(73,40,0,0.7)]">
                      {formattedStartHour} - {formattedEndHour}
                    </Text>
                  </View>
                </View>

                {/* Participants */}
                <View className='flex-row gap-2 items-start'>
                  <Users size={16} color='#492800' strokeWidth={1.5} />
                  <View className='flex-col gap-2'>
                    <Text className="font-['poppins-medium'] text-xs text-[rgba(73,40,0,0.7)]">
                      {t('events.participants')}
                    </Text>
                    <Text className="font-['poppins-light'] text-sm text-[rgba(73,40,0,0.7)]">
                      {event.maxPeople}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Description Section */}
          <View className='flex-col gap-3 mb-6'>
            <Text className="font-['poppins-medium'] text-lg text-[#492800]">
              {t('events.aboutEvent')}
            </Text>
            <Text className="font-['poppins-light'] text-sm text-[rgba(73,40,0,0.7)] leading-5">
              {event.description}
            </Text>

            {/* Restaurant Details Button */}
            <TouchableOpacity
              className='flex-row justify-center items-center gap-2 bg-white border border-[#D38B5D] rounded-[54px] py-3 px-10 mt-3'
              onPress={() => {
                // TODO: Navigate to restaurant details
                router.push(`/location/${event.location.id}`);
              }}
            >
              <Text className="font-['poppins-medium'] text-base text-[#492800]">
                {t('events.restaurantDetails')}
              </Text>
              <ArrowRight size={24} color='#492800' strokeWidth={1.5} />
            </TouchableOpacity>
          </View>

          {/* Facilities Section */}
          <View className='flex-col gap-2 mb-6'>
            <Text className="font-['poppins-medium'] text-sm text-[#492800]">
              {t('events.facilities')}
            </Text>
            <View className='flex-row flex-wrap gap-2'>
              {selectedLocation?.LocationFacility?.map((locationFacility) => (
                <View
                  key={locationFacility.id}
                  className='bg-[rgba(211,139,93,0.21)] rounded-[35px] px-2.5 py-1'
                >
                  <Text className="font-['poppins-medium'] text-xs text-[#99621E]">
                    {locationFacility.facility.name}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* What's Included & Requirements */}
          <View className='flex-col gap-4 mb-6'>
            {/* What's Included Section */}
            {event.includedOptions && event.includedOptions.length > 0 && (
              <View className='flex-col gap-2'>
                <Text className="font-['poppins-medium'] text-sm text-[#492800]">
                  {t('events.whatsIncluded')}
                </Text>
                <View className='flex-col gap-2'>
                  {event.includedOptions.map((option) => (
                    <View
                      key={option.id}
                      className='flex-row items-center gap-2.5'
                    >
                      <CheckCircle size={18} color='#fff' fill='#00AC47' />
                      <Text className="font-['poppins-light'] text-sm text-black">
                        {option.name}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* What's Required Section */}
            {event.requirements && event.requirements.length > 0 && (
              <View className='flex-col gap-2'>
                <Text className="font-['poppins-medium'] text-sm text-[#492800]">
                  {t('events.whatsRequired')}
                </Text>
                <View className='flex-col gap-2'>
                  {event.requirements.map((requirement) => (
                    <View
                      key={requirement.id}
                      className='flex-row items-center gap-2.5'
                    >
                      <Square size={18} color='#FFA91A' fill='#FFA91A' />
                      <Text className="font-['poppins-light'] text-sm text-black">
                        {requirement.name}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>

          {/* Action Buttons */}
          <View>
            <TouchableOpacity
              className='flex-row justify-center items-center gap-2 bg-[#D38B5D] rounded-[54px] py-3 px-10'
              onPress={() => {
                // Check if user is authenticated
                if (!isAuthenticated) {
                  // Set redirect path and go to login
                  setRedirectAfterLogin(`/booking/event/${id}`);
                  router.push('/login');
                  return;
                }

                router.push(`/booking/event/${id}` as Href);
              }}
            >
              <Text className="font-['poppins-medium'] text-base text-white">
                {t('events.makeReservation')}
              </Text>
              <ArrowRight size={24} color='#FFFFFF' strokeWidth={1.5} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
