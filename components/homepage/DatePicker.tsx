import { View, Text, TouchableOpacity, Pressable, Modal } from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import { Calendar } from "react-native-calendars";
import CalendarIcon from "@/assets/events-filter-icons/calendar.svg";
import { DatePickerProps } from "@/types/datePicker";
import { useLanguage } from "@/hooks/useLanguage";

const DatePicker = ({ onDateChange }: DatePickerProps) => {
  const { t, getLocale } = useLanguage();
  const [showCalendar, setShowCalendar] = useState<boolean>(false);
  const [selectedStartDate, setSelectedStartDate] = useState<string>("");
  const [selectedEndDate, setSelectedEndDate] = useState<string>("");
  const [markedDates, setMarkedDates] = useState({});

  const onDayPress = (day: any) => {
    const dateString = day.dateString;

    if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
      // Start new selection
      setSelectedStartDate(dateString);
      setSelectedEndDate("");
      setMarkedDates({
        [dateString]: {
          selected: true,
          startingDay: true,
          color: "#D38B5D",
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
        color: "#D38B5D",
      };

      // Mark all dates in between
      const current = new Date(actualStart);
      current.setDate(current.getDate() + 1);

      while (current < actualEnd) {
        const currentString = current.toISOString().split("T")[0];
        newMarkedDates[currentString] = {
          selected: true,
          color: "#D38B5D",
        };
        current.setDate(current.getDate() + 1);
      }

      // Mark end date
      newMarkedDates[actualEndString] = {
        selected: true,
        endingDay: true,
        color: "#D38B5D",
      };

      setMarkedDates(newMarkedDates);
    }
  };

  const formatDateForDisplay = useCallback(
    (dateString: string) => {
      const locale = getLocale();
      const date = new Date(dateString);
      return date.toLocaleDateString(locale, {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    },
    [getLocale]
  );

  // Call the callback whenever dates change
  useEffect(() => {
    if (!onDateChange) return;

    const display =
      selectedStartDate && selectedEndDate
        ? `${formatDateForDisplay(selectedStartDate)} - ${formatDateForDisplay(selectedEndDate)}`
        : selectedStartDate
          ? formatDateForDisplay(selectedStartDate)
          : "";

    onDateChange(display);
  }, [selectedStartDate, selectedEndDate, onDateChange, formatDateForDisplay]);

  const closeCalendar = () => {
    setShowCalendar(false);
  };

  return (
    <TouchableOpacity
      onPress={() => setShowCalendar(true)}
      className="mt-3 min-h-12 w-[15%] items-center justify-center rounded-[10px] border border-[#D38B5D36] px-2"
    >
      <CalendarIcon />

      <Modal
        visible={showCalendar}
        transparent={true}
        animationType="fade"
        onRequestClose={closeCalendar}
      >
        <View className="flex-1 items-center justify-center bg-black/50">
          <View className="max-w-81 mx-4 w-full rounded-[15px] bg-white p-4">
            <View className="mb-4 flex-row items-center justify-between">
              <Text className="font-['poppins-semibold'] text-lg text-[#492800]">
                {t("homepage.selectInterval")}
              </Text>
              <Pressable onPress={closeCalendar}>
                <Text className="font-['poppins-medium'] text-[#D38B5D]">
                  {t("common.close")}
                </Text>
              </Pressable>
            </View>

            <Calendar
              onDayPress={onDayPress}
              markedDates={markedDates}
              markingType="period"
              theme={{
                backgroundColor: "#ffffff",
                calendarBackground: "#ffffff",
                textSectionTitleColor: "#492800",
                selectedDayBackgroundColor: "#D38B5D",
                selectedDayTextColor: "#ffffff",
                todayTextColor: "#D38B5D",
                dayTextColor: "#492800",
                textDisabledColor: "#d9e1e8",
                dotColor: "#D38B5D",
                selectedDotColor: "#ffffff",
                arrowColor: "#D38B5D",
                monthTextColor: "#492800",
                indicatorColor: "#D38B5D",
                textDayFontFamily: "poppins-regular",
                textMonthFontFamily: "poppins-semibold",
                textDayHeaderFontFamily: "poppins-medium",
                textDayFontSize: 16,
                textMonthFontSize: 18,
                textDayHeaderFontSize: 14,
              }}
            />

            <View className="mt-4 flex-row justify-between">
              <Pressable
                onPress={() => {
                  setSelectedStartDate("");
                  setSelectedEndDate("");
                  setMarkedDates({});
                }}
                className="rounded-[8px] bg-gray-200 px-4 py-2"
              >
                <Text className="font-['poppins-medium'] text-[#492800]">
                  {t("common.reset")}
                </Text>
              </Pressable>

              <Pressable
                onPress={closeCalendar}
                className="rounded-[8px] bg-[#D38B5D] px-4 py-2"
              >
                <Text className="font-['poppins-medium'] text-white">
                  {t("common.confirm")}
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
