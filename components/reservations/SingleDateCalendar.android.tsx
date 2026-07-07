import React, { useCallback } from "react";
import { View, Text } from "react-native";
import { Host, DateTimePicker } from "@expo/ui/jetpack-compose";
import type { SingleDateCalendarProps } from "@/types/singleDateCalendar";

const toDate = (dateString?: string): Date => {
  if (!dateString) return new Date();
  const [y, m, d] = dateString.split("-").map(Number);
  return new Date(y, m - 1, d);
};

const toDateString = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const todayStart = new Date();
todayStart.setHours(0, 0, 0, 0);

export default function SingleDateCalendar({
  onDateSelect,
  selectedDate,
  title,
}: SingleDateCalendarProps) {
  const handleSelect = useCallback(
    (d: Date) => {
      onDateSelect?.(toDateString(d));
    },
    [onDateSelect]
  );

  return (
    <View className="w-full rounded-[15px] bg-white">
      {title && (
        <View className="mb-4 flex-row items-center justify-between">
          <Text className="font-['poppins-medium'] text-sm text-[#000]">
            {title}
          </Text>
        </View>
      )}
      <Host matchContents={{ vertical: true }} style={{ width: "100%" }}>
        <DateTimePicker
          initialDate={toDate(selectedDate).toISOString()}
          onDateSelected={handleSelect}
          displayedComponents="date"
          variant="picker"
          color="#D38B5D"
          selectableDates={{ start: todayStart }}
        />
      </Host>
    </View>
  );
}
