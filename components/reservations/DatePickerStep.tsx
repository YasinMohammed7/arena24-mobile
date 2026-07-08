import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Platform,
} from "react-native";
import { useForm, useWatch } from "react-hook-form";
import FormInput from "@/components/auth/FormInput";
import Checkbox from "@/components/shared/Checkbox";
import SingleDateCalendarIOS from "@/components/reservations/SingleDateCalendar.ios";
import SingleDateCalendarAndroid from "@/components/reservations/SingleDateCalendar.android";
import PersonNumberSelector from "@/components/reservations/PersonNumberSelector";
import { useLocationsStore } from "@/zustand/locationsStore";
import { useDateReservationStore } from "@/zustand/dateReservationStore";
import { useEffect } from "react";
import { useLanguage } from "@/hooks/useLanguage";

export default function DatePickerStep({
  locationId,
  type,
}: {
  locationId: number | null;
  type: string;
}) {
  const { t } = useLanguage();

  // Get state and actions from store
  const {
    selectedDate,
    selectedNumber,
    selectedTimeSlotId,
    isAllDay,
    guestInput,
    setSelectedDate,
    setSelectedNumber,
    setSelectedTimeSlotId,
    setIsAllDay,
    setGuestInput,
  } = useDateReservationStore();

  // Form for guest input
  const { control } = useForm({
    defaultValues: {
      guestInput,
    },
  });

  // Watch form changes and sync with store
  const watchedGuestInput = useWatch({ name: "guestInput", control });
  useEffect(() => {
    setGuestInput(watchedGuestInput || "");
  }, [watchedGuestInput, setGuestInput]);

  // Reset time slot when locationId changes
  useEffect(() => {
    if (locationId) {
      setSelectedTimeSlotId(null);
    }
  }, [locationId, setSelectedTimeSlotId]);
  const location = useLocationsStore((state) =>
    locationId ? state.locations.find((loc) => loc.id === locationId) : null
  );

  const handleDateSelect = (date: string) => {
    console.log("Selected date:", date);
    setSelectedDate(date);
  };

  const handleNumberSelect = (number: number) => {
    console.log("Selected number:", number);
    setSelectedNumber(number);
  };

  // Guest input handler moved to FormInput component

  const handleTimeSlotSelect = (timeSlot: string) => {
    console.log("Selected time slot:", timeSlot);
    setSelectedTimeSlotId(timeSlot);
  };

  // Get today's day index in API format: 1=Monday ... 7=Sunday
  const getCurrentApiDay = (): number => {
    const jsDay = new Date().getDay(); // 0=Sunday, 1=Monday ... 6=Saturday
    return jsDay === 0 ? 7 : jsDay;
  };

  // Function to generate hourly time slots (excluding last hour)
  const generateHourlySlots = (startTime: string, endTime: string) => {
    const slots: string[] = [];
    const [startHour] = startTime.split(":").map(Number);
    let [endHour, endMinute] = endTime.split(":").map(Number);

    // Handle midnight (00:00) as end of day (24:00)
    if (endHour === 0 && endMinute === 0) {
      endHour = 24;
    }

    let currentHour = startHour;
    const endTotalMinutes = endHour * 60 + endMinute;

    // Handle case where end time is next day (crosses midnight)
    const actualEndMinutes = endHour === 24 ? 24 * 60 : endTotalMinutes;

    while (currentHour * 60 < actualEndMinutes) {
      // Convert to 24-hour format, handling day wrap-around
      const displayHour = currentHour >= 24 ? currentHour - 24 : currentHour;
      const timeString = `${displayHour.toString().padStart(2, "0")}:00`;
      slots.push(timeString);
      currentHour++;

      // Prevent infinite loop
      if (currentHour > 48) break;
    }

    return slots;
  };

  return (
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      {/* Date Section */}
      <Text className="mb-2 font-['poppins-medium'] text-sm text-[#000000]">
        {t("reservations.numberOfGuests")}
      </Text>
      <View className="mb-5">
        {type === "event" ? (
          <FormInput
            name="guestInput"
            control={control}
            label=""
            placeholder={t("reservations.enterNumberOfGuests")}
            keyboardType="numeric"
            maxLength={2}
          />
        ) : (
          <View className="mb-3">
            <PersonNumberSelector
              onSelectNumber={handleNumberSelect}
              selectedNumber={selectedNumber}
              maxNumber={12}
              minNumber={1}
            />
          </View>
        )}
        {Platform.OS === "android" ? (
          <SingleDateCalendarAndroid
            onDateSelect={handleDateSelect}
            selectedDate={selectedDate}
            title={t("reservations.date")}
          />
        ) : (
          <SingleDateCalendarIOS
            onDateSelect={handleDateSelect}
            selectedDate={selectedDate}
            title={t("reservations.date")}
          />
        )}
      </View>

      {type === "location" ? (
        <>
          <Text className="mb-4 font-['poppins-medium'] text-sm text-[#000000]">
            {t("reservations.time")}
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mb-4"
            contentContainerStyle={{ gap: 8 }}
          >
            <View className="flex flex-row gap-2">
              {(() => {
                const currentApiDay = getCurrentApiDay();
                const todaySchedules =
                  location?.schedules.filter(
                    (s) => s.dayOfWeek === currentApiDay
                  ) || [];

                // Get all hourly slots from all matching schedules
                const allTimeSlots: string[] = [];
                todaySchedules.forEach((schedule) => {
                  console.log(
                    `Generating slots for schedule: ${schedule.startTime} - ${schedule.endTime}`
                  );
                  const hourlySlots = generateHourlySlots(
                    schedule.startTime,
                    schedule.endTime
                  );
                  console.log("Generated slots:", hourlySlots);
                  hourlySlots.forEach((slot) => {
                    if (!allTimeSlots.includes(slot)) {
                      allTimeSlots.push(slot);
                    }
                  });
                });
                console.log("Final all time slots:", allTimeSlots);

                // Sort time slots
                allTimeSlots.sort();

                return allTimeSlots.map((timeSlot, index) => {
                  const isSelected = selectedTimeSlotId === timeSlot;

                  return (
                    <TouchableOpacity
                      key={`${timeSlot}-${index}`}
                      onPress={() => handleTimeSlotSelect(timeSlot)}
                      className={`rounded-[14px] border px-4 py-3 ${
                        isSelected
                          ? "border-[#D38B5D] bg-[#D38B5D]"
                          : "border-gray-100 bg-white"
                      }`}
                    >
                      <Text
                        className={`font-['poppins-medium'] text-sm ${
                          isSelected ? "text-white" : "text-[#492800]"
                        }`}
                      >
                        {timeSlot}
                      </Text>
                    </TouchableOpacity>
                  );
                });
              })()}
            </View>
          </ScrollView>
        </>
      ) : (
        <Checkbox
          label={t("reservations.allDay")}
          value={isAllDay}
          onValueChange={setIsAllDay}
        />
      )}
    </ScrollView>
  );
}
