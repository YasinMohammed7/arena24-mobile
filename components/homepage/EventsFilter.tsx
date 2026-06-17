import { View, Text, TouchableOpacity, Animated } from 'react-native';
import ArrowDownIcon from '@/assets/events-filter-icons/arrow-down.svg';
import FilterIcon from '@/assets/events-filter-icons/filter.svg';
import LocationIcon from '@/assets/events-filter-icons/location-filter.svg';
import Dropdown from '../Dropdown';
import { useRef, useEffect } from 'react';
import DatePicker from './DatePicker';
import { DropdownData } from '@/types/dropdown';
import PeopleIcon from '@/assets/events-filter-icons/people-icon.svg';
import DollarIcon from '@/assets/events-filter-icons/dollar-circle.svg';
import Slider from '../Slider';
import { useEventsFilterStore } from '@/zustand/eventsFilterStore';
import { useLanguage } from '@/hooks/useLanguage';

const EventsFilter = () => {
  const { t } = useLanguage();
  // Use specific events filter store
  // Access store state with selectors for optimized performance
  const isEventsFilterDropdownVisible = useEventsFilterStore(
    (state) => state.isEventsFilterDropdownVisible
  );
  const selectedDateText = useEventsFilterStore(
    (state) => state.selectedDateText
  );
  const selectedLocations = useEventsFilterStore(
    (state) => state.selectedLocations
  );
  const selectedPersonNumber = useEventsFilterStore(
    (state) => state.selectedPersonNumber
  );
  const toggleEventsFilterDropdown = useEventsFilterStore(
    (state) => state.toggleEventsFilterDropdown
  );
  const setEventsFilterAnimating = useEventsFilterStore(
    (state) => state.setEventsFilterAnimating
  );
  const setSelectedDateText = useEventsFilterStore(
    (state) => state.setSelectedDateText
  );
  const setSelectedLocations = useEventsFilterStore(
    (state) => state.setSelectedLocations
  );
  const setSelectedPersonNumber = useEventsFilterStore(
    (state) => state.setSelectedPersonNumber
  );

  const locationsData: DropdownData[] = [
    { label: 'Studio', value: 'studio' },
    { label: 'Iancu', value: 'iancu' },
    { label: 'Iancu Jianu', value: 'iancu-jianu' },
  ];

  const personNumber: DropdownData[] = [
    { label: '1', value: '1' },
    { label: '2', value: '2' },
    { label: '3', value: '3' },
  ];

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  // Effect to handle animations when dropdown visibility changes
  useEffect(() => {
    if (isEventsFilterDropdownVisible) {
      // Show with animation
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setEventsFilterAnimating(false);
      });
    } else {
      // Hide with animation
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setEventsFilterAnimating(false);
      });
    }
  }, [isEventsFilterDropdownVisible]);

  // Reusable animated style for dropdown items
  const dropdownItemStyle = {
    opacity: fadeAnim,
    transform: [
      {
        translateY: slideAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [-20, 0],
        }),
      },
    ],
  };

  return (
    <View className={`w-full border-y border-[#D38B5D24] p-4`}>
      <View className='flex flex-row items-center justify-between'>
        <View className='flex flex-row items-center gap-2'>
          <FilterIcon />
          <Text className={`font-['poppins-regular'] text-sm text-[#99621E]`}>
            {t('homepage.filterEvents')}
          </Text>
        </View>
        <TouchableOpacity onPress={toggleEventsFilterDropdown}>
          <ArrowDownIcon
            style={{
              transform: [
                { rotate: isEventsFilterDropdownVisible ? '180deg' : '0deg' },
              ],
            }}
          />
        </TouchableOpacity>
      </View>
      <View className='flex flex-row items-center gap-2 justify-between'>
        <Dropdown
          data={locationsData}
          placeholder={t('homepage.allLocations')}
          searchPlaceholder={t('homepage.searchLocation')}
          leftIcon={<LocationIcon />}
          rightIcon={<ArrowDownIcon />}
          width='w-[80%]'
          selectedPlaceholder={t('homepage.selectedLocations')}
          value={selectedLocations}
          onValueChange={setSelectedLocations}
        />
        <DatePicker onDateChange={setSelectedDateText} />
      </View>
      {selectedDateText && (
        <View className='flex flex-row'>
          <Text className="border border-[#D38B5D] bg-[#D38B5D] text-[#fff] rounded-[10px] p-2 font-['poppins-regular'] text-sm mt-2">
            {selectedDateText}
          </Text>
        </View>
      )}
      {isEventsFilterDropdownVisible && (
        <>
          <Animated.View
            className='flex flex-row items-center gap-2 mt-4 ml-1'
            style={dropdownItemStyle}
          >
            <PeopleIcon />
            <Text className={`font-['poppins-regular'] text-sm`}>
              {t('homepage.numberOfPeople')}
            </Text>
          </Animated.View>
          <Animated.View
            className='flex flex-row items-center gap-2 justify-between'
            style={dropdownItemStyle}
          >
            <Dropdown
              data={personNumber}
              placeholder={t('homepage.anyNumber')}
              searchPlaceholder={t('homepage.searchNumberPeople')}
              leftIcon={null}
              rightIcon={<ArrowDownIcon />}
              width='w-full'
              selectedPlaceholder={t('homepage.selectedNumberPeople')}
              value={selectedPersonNumber}
              onValueChange={setSelectedPersonNumber}
            />
          </Animated.View>
          <Animated.View
            className='flex flex-row items-center gap-2 mt-4 ml-1'
            style={dropdownItemStyle}
          >
            <DollarIcon />
            <Text className={`font-['poppins-regular'] text-sm`}>
              {t('homepage.pricePerPerson')}
            </Text>
          </Animated.View>
          <Animated.View style={dropdownItemStyle}>
            <Slider
              min={0}
              max={500}
              rangeArr={[0, 500]}
              um={t('currency.lei')}
            />
            <View className='flex-row gap-3 mt-4'>
              <TouchableOpacity
                className='bg-[#D38B5D] rounded-full py-3 px-6 flex-1 items-center'
                onPress={() => {
                  // Handle filter application
                  console.log('Applying filters...');
                  console.log('Selected locations:', selectedLocations);
                  console.log('Selected person number:', selectedPersonNumber);
                  console.log('Selected date:', selectedDateText);
                }}
              >
                <Text className="text-white font-['poppins-medium'] text-sm">
                  {t('homepage.applyFilters')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className='border border-[#D38B5D] rounded-full py-3 px-6 flex-1 items-center'
                onPress={() => {
                  // Handle filter reset
                  console.log('Resetting filters...');
                  setSelectedLocations([]);
                  setSelectedPersonNumber([]);
                  setSelectedDateText('');
                  // Note: Slider will reset to its default range automatically since it uses internal state
                }}
              >
                <Text className="text-[#D38B5D] font-['poppins-medium'] text-sm">
                  {t('common.reset')}
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </>
      )}
    </View>
  );
};

export default EventsFilter;
