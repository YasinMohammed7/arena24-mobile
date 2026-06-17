import {
  View,
  Text,
  Platform,
  TouchableOpacity,
  Pressable,
  Modal,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { Calendar } from 'react-native-calendars';
import CalendarIcon from '@/assets/events-filter-icons/calendar.svg';
import { DatePickerProps } from '@/types/datePicker';
import { useLanguage } from '@/hooks/useLanguage';

const DatePicker = ({ onDateChange }: DatePickerProps) => {
  const { t, getLocale } = useLanguage();
  const [showCalendar, setShowCalendar] = useState<boolean>(false);
  const [selectedStartDate, setSelectedStartDate] = useState<string>('');
  const [selectedEndDate, setSelectedEndDate] = useState<string>('');
  const [markedDates, setMarkedDates] = useState({});

  const onDayPress = (day: any) => {
    const dateString = day.dateString;

    if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
      // Start new selection
      setSelectedStartDate(dateString);
      setSelectedEndDate('');
      setMarkedDates({
        [dateString]: {
          selected: true,
          startingDay: true,
          color: '#D38B5D',
        },
      });
    } else {
      // Complete the selection
      const start = new Date(selectedStartDate);
      const end = new Date(dateString);

      // Determine the actual start and end dates (handle reverse selection)
      const actualStart = start < end ? start : end;
      const actualEnd = start < end ? end : start;
      const actualStartString = start < end ? selectedStartDate : dateString;
      const actualEndString = start < end ? dateString : selectedStartDate;

      // Update state with correct order
      setSelectedStartDate(actualStartString);
      setSelectedEndDate(actualEndString);

      // Mark all dates in range
      const newMarkedDates: any = {};

      // Mark start date
      newMarkedDates[actualStartString] = {
        selected: true,
        startingDay: true,
        color: '#D38B5D',
      };

      // Mark all dates in between
      const current = new Date(actualStart);
      current.setDate(current.getDate() + 1);

      while (current < actualEnd) {
        const currentString = current.toISOString().split('T')[0];
        newMarkedDates[currentString] = {
          selected: true,
          color: '#D38B5D',
        };
        current.setDate(current.getDate() + 1);
      }

      // Mark end date
      newMarkedDates[actualEndString] = {
        selected: true,
        endingDay: true,
        color: '#D38B5D',
      };

      setMarkedDates(newMarkedDates);
    }
  };

  const formatDateForDisplay = (dateString: string) => {
    const locale = getLocale();
    const date = new Date(dateString);
    return date.toLocaleDateString(locale, {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const getDisplayText = () => {
    if (selectedStartDate && selectedEndDate) {
      return `${formatDateForDisplay(
        selectedStartDate
      )} - ${formatDateForDisplay(selectedEndDate)}`;
    } else if (selectedStartDate) {
      return `${formatDateForDisplay(selectedStartDate)}`;
    } else {
      return '';
    }
  };

  // Call the callback whenever dates change
  useEffect(() => {
    if (onDateChange) {
      onDateChange(getDisplayText());
    }
  }, [selectedStartDate, selectedEndDate, onDateChange]);

  const closeCalendar = () => {
    setShowCalendar(false);
  };

  return (
    <TouchableOpacity
      onPress={() => setShowCalendar(true)}
      className='border border-[#D38B5D36] rounded-[10px] mt-3 w-[15%] min-h-12 justify-center items-center px-2'
    >
      <CalendarIcon />

      <Modal
        visible={showCalendar}
        transparent={true}
        animationType='fade'
        onRequestClose={closeCalendar}
      >
        <View className='flex-1 bg-black/50 justify-center items-center'>
          <View className='bg-white rounded-[15px] p-4 mx-4 max-w-81 w-full'>
            <View className='flex-row justify-between items-center mb-4'>
              <Text className="text-lg font-['poppins-semibold'] text-[#492800]">
                {t('homepage.selectInterval')}
              </Text>
              <Pressable onPress={closeCalendar}>
                <Text className="text-[#D38B5D] font-['poppins-medium']">
                  {t('common.close')}
                </Text>
              </Pressable>
            </View>

            <Calendar
              onDayPress={onDayPress}
              markedDates={markedDates}
              markingType='period'
              theme={{
                backgroundColor: '#ffffff',
                calendarBackground: '#ffffff',
                textSectionTitleColor: '#492800',
                selectedDayBackgroundColor: '#D38B5D',
                selectedDayTextColor: '#ffffff',
                todayTextColor: '#D38B5D',
                dayTextColor: '#492800',
                textDisabledColor: '#d9e1e8',
                dotColor: '#D38B5D',
                selectedDotColor: '#ffffff',
                arrowColor: '#D38B5D',
                monthTextColor: '#492800',
                indicatorColor: '#D38B5D',
                textDayFontFamily: 'poppins-regular',
                textMonthFontFamily: 'poppins-semibold',
                textDayHeaderFontFamily: 'poppins-medium',
                textDayFontSize: 16,
                textMonthFontSize: 18,
                textDayHeaderFontSize: 14,
              }}
            />

            <View className='flex-row justify-between mt-4'>
              <Pressable
                onPress={() => {
                  setSelectedStartDate('');
                  setSelectedEndDate('');
                  setMarkedDates({});
                }}
                className='bg-gray-200 px-4 py-2 rounded-[8px]'
              >
                <Text className="text-[#492800] font-['poppins-medium']">
                  {t('common.reset')}
                </Text>
              </Pressable>

              <Pressable
                onPress={closeCalendar}
                className='bg-[#D38B5D] px-4 py-2 rounded-[8px]'
              >
                <Text className="text-white font-['poppins-medium']">
                  {t('common.confirm')}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </TouchableOpacity>
  );
};

export default DatePicker;
