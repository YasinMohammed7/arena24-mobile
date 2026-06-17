import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Platform,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Redirect, useRouter } from 'expo-router';
import Header from '@/components/homepage/Header';
import LineArrowRight from '@/assets/carouselIcons/line-arrow-right.svg';
import '../../global.css';
import CardRest from '@/components/homepage/CardRest';
import EventsFilter from '@/components/homepage/EventsFilter';
import CardEvent from '@/components/homepage/CardEvent';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  runOnJS,
} from 'react-native-reanimated';
import { useAuthStore } from '@/zustand/authStore';
import { useLocationsStore } from '@/zustand/locationsStore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { EventType } from '@/types/events';
import { useEventsStore } from '@/zustand/eventsStore';
import { useRefresh } from '@/hooks/useRefresh';
import { useLanguage } from '@/hooks/useLanguage';

/* ------------------------------------------------------------------
 * HomeScreen (main component)
 * ----------------------------------------------------------------*/
export default function HomeScreen() {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const { t } = useLanguage();

  // Avoid flicker if width is 0 on first web paint
  if (width === 0) return null;

  // Redirect before rendering UI
  if (isTablet) {
    return <Redirect href='/desktop' />;
  }

  const [hasReachedEventsFilter, setHasReachedEventsFilter] = useState(false);
  const [eventsFilterThreshold, setEventsFilterThreshold] = useState<number>(0);
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { locations, isLoading, error, fetchLocations, clearLocations } =
    useLocationsStore();
  const {
    events,
    isLoading: eventsLoading,
    error: eventsError,
    fetchEvents,
    clearEvents,
  } = useEventsStore();

  // Pull-to-refresh functionality
  const { refreshing, onRefresh } = useRefresh({
    onRefresh: async () => {
      await Promise.all([fetchLocations(), fetchEvents()]);
    },
  });

  // Fetch locations on mount
  useEffect(() => {
    fetchLocations();
    fetchEvents();
  }, []);

  // Handle authentication state changes
  useEffect(() => {
    if (!isAuthenticated) {
      // User logged out - clear locations and fetch to show error
      clearLocations();
      clearEvents();
      fetchLocations();
      fetchEvents();
    } else {
      // User logged in - fetch locations
      fetchLocations();
      fetchEvents();
    }
  }, [isAuthenticated]);

  // useEffect(() => {
  //   AsyncStorage.getAllKeys().then(async (keys) => {
  //     const keyValuePairs = await AsyncStorage.multiGet(keys);
  //     keyValuePairs.forEach(async ([key, value]) => {
  //       console.log(`Key: ${key}, Value: ${value}`);
  //       // await AsyncStorage.removeItem(key);
  //     });
  //   });

  //   // delete all keys
  //   // AsyncStorage.clear();

  //   console.log(user, isAuthenticated);
  // }, []);

  // Reanimated shared values
  const scrollY = useSharedValue(0);
  const eventsFilterPosition = useSharedValue(0);

  // Threshold offset (adjust as needed)
  const THRESHOLD_OFFSET = 0; // No offset - trigger exactly when reaching the component

  // Function to update threshold state (runs on JS thread)
  const updateThresholdState = (reached: boolean) => {
    setHasReachedEventsFilter(reached);
    // console.log("EventsFilter threshold:", reached ? "REACHED" : "NOT REACHED");
  };

  // Reanimated scroll handler
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;

      // Check if we've reached the EventsFilter threshold
      const adjustedThreshold = eventsFilterPosition.value - THRESHOLD_OFFSET;
      const hasReached =
        scrollY.value >= adjustedThreshold && eventsFilterPosition.value > 0;

      // Update state on JS thread
      runOnJS(updateThresholdState)(hasReached);
    },
  });

  // Function to measure EventsFilter position
  const measureEventsFilterPosition = (y: number) => {
    eventsFilterPosition.value = y;
    setEventsFilterThreshold(y);
    // console.log("EventsFilter position measured:", y);
  };

  // Animated style for sticky EventsFilter with smooth transitions
  const stickyEventsFilterStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [eventsFilterPosition.value, eventsFilterPosition.value + 20],
      [0, 1],
      'clamp'
    );

    const translateY = interpolate(
      scrollY.value,
      [eventsFilterPosition.value, eventsFilterPosition.value + 20],
      [-50, 0],
      'clamp'
    );

    return {
      opacity,
      transform: [{ translateY }],
    };
  });

  // Animated style for original EventsFilter to fade out
  const originalEventsFilterStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [eventsFilterPosition.value - 20, eventsFilterPosition.value],
      [1, 0],
      'clamp'
    );

    const translateY = interpolate(
      scrollY.value,
      [eventsFilterPosition.value - 20, eventsFilterPosition.value],
      [0, -20],
      'clamp'
    );

    return {
      opacity,
      transform: [{ translateY }],
    };
  });

  return (
    <SafeAreaView
      className='flex-1 bg-[#FEFEFE]'
      edges={['top', 'left', 'right']}
    >
      {/* Sticky EventsFilter - always present but animated */}
      {/* <Animated.View
        className="absolute top-0 left-0 right-0 z-10 pt-10 bg-white"
        style={stickyEventsFilterStyle}
      >
        <EventsFilter />
      </Animated.View> */}

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor='#D38B5D'
            colors={['#D38B5D']}
          />
        }
      >
        {/* ---------------- HEADER ---------------- */}
        <Header
          title={
            user?.name
              ? t('homepage.welcomeUser', { name: user?.name })
              : t('homepage.welcome')
          }
          description={t('homepage.discoverRestaurants')}
          paddingX='px-5 pt-2'
          imgSrc={user?.imageUrl ?? ''}
        />
        {/* ---------------- Restaurants SECTION ---------------- */}
        <View className='px-5'>
          <View className='flex-row justify-between items-center'>
            <Text
              className={`font-['poppins-medium'] text-lg leading-none text-[#492800] ${
                Platform.OS === 'ios' ? 'pt-3' : ''
              }`}
            >
              {t('homepage.ourLocations')}
            </Text>
            <TouchableOpacity
              onPress={() =>
                router.push('/(navigationBar)/(locations)/locationsList')
              }
            >
              <LineArrowRight color='#99621E' />
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className='py-3'
          >
            {isLoading ? (
              <View className='flex-row items-center py-4 px-2'>
                <ActivityIndicator size='small' color='#99621E' />
                <Text className="text-[#99621E] font-['poppins-regular'] text-sm ml-2">
                  {t('homepage.loadingLocations')}
                </Text>
              </View>
            ) : error ? (
              <Text className="text-red-500 font-['poppins-regular'] text-sm py-4">
                {error}
              </Text>
            ) : (
              locations.map((location) => (
                <CardRest key={location.id} location={location} />
              ))
            )}
          </ScrollView>
        </View>

        {/* EventsFilter with position measurement and animated transitions */}
        <Animated.View
          style={originalEventsFilterStyle}
          onLayout={(event) => {
            const { y } = event.nativeEvent.layout;
            measureEventsFilterPosition(y);
          }}
        >
          {/* <EventsFilter /> */}
        </Animated.View>

        <View className='mt-5 border-t border-l border-r border-[#F1F1F1] rounded-t-[36px] px-5'>
          <Header
            title={t('homepage.events')}
            description={t('homepage.discoverExperiences')}
            paddingTop='pt-6'
            paddingX='px-2'
          />
          {eventsLoading ? (
            <View className='flex-row items-center py-4 px-2'>
              <ActivityIndicator size='small' color='#99621E' />
              <Text className="text-[#99621E] font-['poppins-regular'] text-sm ml-2">
                {t('homepage.loadingEvents')}
              </Text>
            </View>
          ) : eventsError ? (
            <Text className="text-red-500 font-['poppins-regular'] text-sm py-4">
              {eventsError}
            </Text>
          ) : (
            <FlatList
              data={events}
              keyExtractor={(item: EventType) => item.id.toString()}
              renderItem={({ item }) => <CardEvent event={item} />}
              showsVerticalScrollIndicator={false}
              scrollEnabled={false}
            />
          )}
        </View>
      </Animated.ScrollView>
    </SafeAreaView>
  );
}
