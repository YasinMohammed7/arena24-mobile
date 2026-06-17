import {
  View,
  Text,
  Image,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import React, { useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useOffersStore } from '@/zustand/offersStore';
import { offersItem } from '@/types/offers';
import Button from '@/components/shared/Button';
import { useRefresh } from '@/hooks/useRefresh';
import { useLanguage } from '@/hooks/useLanguage';

// SVG Icons
import CalendarIcon from '@/assets/carouselIcons/calendar-outline.svg';
import LocationIcon from '@/assets/carouselIcons/location.svg';
import StarIcon from '@/assets/carouselIcons/star.svg';
import ArrowRightIcon from '@/assets/carouselIcons/line-arrow-right.svg';

export default function OfferDetail() {
  const { t, getLocale } = useLanguage();
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { offerDetail, isLoadingDetail, errorDetail, fetchOfferById } =
    useOffersStore();

  const { height: screenHeight } = Dimensions.get('window');

  // Pull-to-refresh using custom hook
  const { refreshing, onRefresh } = useRefresh({
    onRefresh: async () => {
      if (id && typeof id === 'string') {
        await fetchOfferById(id);
      }
    },
  });

  useEffect(() => {
    if (id && typeof id === 'string') {
      fetchOfferById(id);
    }
  }, [id]);

  const offer: offersItem | null = offerDetail;

  if (isLoadingDetail) {
    return (
      <SafeAreaView
        edges={['top', 'left', 'right']}
        className='flex-1 bg-white'
      >
        <View className='flex-1 justify-center items-center'>
          <Text className='text-lg font-medium text-gray-600'>
            {t('offers.loading')}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (errorDetail || !offer) {
    return (
      <SafeAreaView
        edges={['top', 'left', 'right']}
        className='flex-1 bg-white'
      >
        <View className='flex-1 justify-center items-center px-4'>
          <Text className='text-lg font-medium text-red-600 text-center'>
            {errorDetail || t('offers.offerNotLoaded')}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const formatDateRange = (startDate: string, endDate: string) => {
    const locale = getLocale();

    const start = new Date(startDate);
    const end = new Date(endDate);
    const startDay = start.getDate();
    const endDay = end.getDate();
    const startMonth = start.toLocaleString(locale, { month: 'long' });
    const endMonth = end.toLocaleString(locale, { month: 'long' });
    const startYear = start.getFullYear();
    const endYear = end.getFullYear();

    // If same month and year
    if (startMonth === endMonth && startYear === endYear) {
      return `${startDay}-${endDay} ${startMonth} ${startYear}`;
    }

    // If different months or years
    return `${startDay} ${startMonth} ${startYear} - ${endDay} ${endMonth} ${endYear}`;
  };

  return (
    <SafeAreaView
      edges={['top', 'left', 'right']}
      className='flex-1 bg-[#FFFDFB]'
    >
      <View className='flex-1'>
        {/* Hero Image Section - Half Screen */}
        <View
          className='relative'
          // style={{ height: screenHeight * 0.5 }}
        >
          <Image
            source={{ uri: offer.image }}
            className='w-full h-[200px]'
            resizeMode='contain'
          />

          {/* Discount Banners */}
          <View className='absolute inset-0 flex justify-center items-center'>
            <View className='flex-row justify-between w-full px-12'>
              <View className='bg-red-500 px-4 py-2 rounded-lg transform -rotate-12'>
                <Text className='text-white text-3xl font-bold'>
                  -{offer.discount}%
                </Text>
              </View>
              <View className='bg-red-500 px-4 py-2 rounded-lg transform rotate-12'>
                <Text className='text-white text-3xl font-bold'>
                  -{offer.discount}%
                </Text>
              </View>
            </View>
          </View>

          {/* Back Arrow Button */}
          <TouchableOpacity
            onPress={() => {
              if (router.canGoBack()) {
                router.back();
              } else {
                router.push('/');
              }
            }}
            className='absolute top-4 left-4 bg-white/10 rounded-full p-2'
            style={{ backdropFilter: 'blur(10px)' }}
          >
            <ArrowRightIcon
              width={20}
              height={20}
              style={{ transform: [{ rotate: '180deg' }] }}
              color='white'
            />
          </TouchableOpacity>
        </View>

        {/* Content Section - Scrollable */}
        <ScrollView
          className='flex-1 px-4 py-2'
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor='#D38B5D' // Color of the refresh indicator
              colors={['#D38B5D']} // Android colors
            />
          }
        >
          {/* Status Information */}
          <ScrollView
            showsHorizontalScrollIndicator={false}
            horizontal
            className='mb-6'
          >
            {/* Date */}
            <View className='flex-row items-center bg-[#D38B5D]/15 border border-[#D38B5D]/30 rounded-2xl px-3 py-2 mr-2'>
              <CalendarIcon
                width={14}
                height={14}
                style={{ marginRight: 8 }}
                color='#99621E'
              />
              <Text className='text-[#99621E] text-xs font-medium'>
                {formatDateRange(offer.startDate, offer.endDate)}
              </Text>
            </View>

            {/* Location */}
            <View className='flex-row items-center bg-[#D38B5D]/15 border border-[#D38B5D]/30 rounded-2xl px-3 py-2 mr-2'>
              <LocationIcon
                width={14}
                height={14}
                style={{ marginRight: 8 }}
                color='#99621E'
              />
              <Text className='text-[#99621E] text-xs font-medium'>
                {offer.location.name}
              </Text>
            </View>

            {/* Rating - Commented out as requested */}
            {/* <View className="flex-row items-center bg-[#D38B5D]/15 border border-[#D38B5D]/30 rounded-2xl px-3 py-2">
              <StarIcon width={14} height={14} style={{ marginRight: 8 }} color="#99621E" />
              <Text className="text-[#99621E] text-xs font-medium">4.8</Text>
            </View> */}
          </ScrollView>

          {/* Title */}
          <Text className='text-black text-lg font-medium mb-4 leading-6'>
            {offer.name}
          </Text>

          {/* Description */}
          <Text className='text-[#492800]/70 text-sm font-light leading-6 mb-8'>
            {offer.description}
          </Text>

          {/* Restaurant Details Button */}
          <Button
            text={t('offers.restaurantDetails')}
            className='bg-white border border-[#D38B5D] rounded-[54px] flex-row justify-center items-center py-3 px-10 mb-8'
            textStyle='text-[#492800] text-base font-medium'
            onPress={() => {
              router.push(`/location/${offer.location.id}`);
            }}
          />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
