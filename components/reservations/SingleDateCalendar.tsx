import { View, Text } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Calendar } from 'react-native-calendars';
import Button from '@/components/shared/Button';
import { SingleDateCalendarProps } from '@/types/singleDateCalendar';
import { useLanguage } from '@/hooks/useLanguage';

const SingleDateCalendar = ({
  onDateSelect,
  selectedDate,
  title,
}: SingleDateCalendarProps) => {
  const { t, getLocale } = useLanguage();
  const locale = getLocale();
  const defaultTitle = title || t('common.selectDate');
  const [selectedDateState, setSelectedDateState] = useState<string>(
    selectedDate || ''
  );
  const [markedDates, setMarkedDates] = useState({});

  useEffect(() => {
    if (selectedDate) {
      setSelectedDateState(selectedDate);
      setMarkedDates({
        [selectedDate]: {
          selected: true,
          selectedColor: '#D38B5D',
        },
      });
    }
  }, [selectedDate]);

  const onDayPress = (day: any) => {
    const dateString = day.dateString;
    setSelectedDateState(dateString);
    setMarkedDates({
      [dateString]: {
        selected: true,
        selectedColor: '#D38B5D',
      },
    });

    if (onDateSelect) {
      onDateSelect(dateString);
    }
  };

  const resetSelection = () => {
    setSelectedDateState('');
    setMarkedDates({});
    if (onDateSelect) {
      onDateSelect('');
    }
  };

  const formatDateForDisplay = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString(locale, {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <View className='bg-white rounded-[15px] w-full'>
      <View className='flex-row justify-between items-center mb-4'>
        <Text className="text-sm font-['poppins-medium'] text-[#000]">
          {defaultTitle}
        </Text>
      </View>

      <Calendar
        onDayPress={onDayPress}
        markedDates={markedDates}
        minDate={new Date().toISOString().split('T')[0]}
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

      {/* <View className="flex-row justify-between mt-4">
        <Button
          text="Reseteaza"
          onPress={resetSelection}
          className="bg-gray-200 px-4 py-2 rounded-[8px]"
          textStyle="text-[#492800] font-['poppins-medium']"
        />

        <Button
          text="Confirmă"
          onPress={() => {
            if (onDateSelect && selectedDateState) {
              onDateSelect(selectedDateState);
            }
          }}
          className="bg-[#D38B5D] px-4 py-2 rounded-[8px]"
          textStyle="text-white font-['poppins-medium']"
        />
      </View>
      {selectedDateState && (
        <Text className="text-[#D38B5D] font-['poppins-medium']">
          {formatDateForDisplay(selectedDateState)}
        </Text>
      )} */}
    </View>
  );
};

export default SingleDateCalendar;
