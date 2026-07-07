import React, { useCallback } from "react";
import { View, Text } from "react-native";
import { Host, DatePicker } from "@expo/ui/swift-ui";
import { datePickerStyle } from "@expo/ui/swift-ui/modifiers";
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
  const handleChange = useCallback(
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
      <Host matchContents>
        <DatePicker
          selection={toDate(selectedDate)}
          displayedComponents={["date"]}
          range={{ start: todayStart }}
          onDateChange={handleChange}
          modifiers={[datePickerStyle("graphical")]}
        />
      </Host>
    </View>
  );
}
