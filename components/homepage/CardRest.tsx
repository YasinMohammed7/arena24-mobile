import { View, Text, Image, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";
import ClockIcon from "@/assets/carouselIcons/clock.svg";
import { Href, router } from "expo-router";
import { LocationListItem } from "@/types/locations";
import { useLanguage } from "@/hooks/useLanguage";
import { checkScheduleAndOpenStatus } from "@/utils/scheduleUtils";

const trimTime = (time: string): string => {
  return time
    .split(" - ")
    .map((t) => t.split(":").slice(0, 2).join(":"))
    .join(" - ");
};

const CardRest = ({ location }: { location: LocationListItem }) => {
  const { t } = useLanguage();
  const initial = checkScheduleAndOpenStatus(location.schedules);
  const [isCurrentlyOpen, setIsCurrentlyOpen] = useState(
    initial.isCurrentlyOpen
  );
  const [currentSchedule, setCurrentSchedule] = useState(
    initial.currentSchedule
  );

  const imageSrc = location.imageUrl || "";

  useEffect(() => {
    const updateStatus = () => {
      const { isCurrentlyOpen: open, currentSchedule: schedule } =
        checkScheduleAndOpenStatus(location.schedules);
      setIsCurrentlyOpen(open);
      setCurrentSchedule(schedule);
    };

    const interval = setInterval(updateStatus, 60000);
    return () => clearInterval(interval);
  }, [location.schedules]);

  return (
    <TouchableOpacity
      onPress={() => router.push(`/location/${location.id}` as Href)}
      className="w-84 h-58 mr-4 overflow-hidden rounded-[10px] border border-[#F1F1F1] bg-white shadow-[0px_4px_9.4px_0px_rgba(0,0,0,0.16)]"
    >
      <View className="relative">
        <Image
          source={{ uri: imageSrc ?? "" }}
          className="h-[148px] w-[248px] rounded-t-[10px]"
          resizeMode="cover"
        />
        <View className="absolute bottom-[8px] right-[8px] overflow-hidden rounded-[11px] bg-black/40 px-[10px] py-[6px]">
          <View className="flex-row items-center gap-1">
            <ClockIcon width={14} height={14} />
            <Text className="font-['poppins-regular'] text-xs text-[#fff]">
              {trimTime(currentSchedule)}
            </Text>
          </View>
          <View className="flex-row items-center gap-1">
            <View
              className={`h-[6px] w-[6px] rounded-full ${
                isCurrentlyOpen ? "bg-[#97F59D]" : "bg-[#FF6B6B]"
              }`}
            />
            <Text className="font-['poppins-regular'] text-xs text-[#fff]">
              {isCurrentlyOpen ? t("homepage.open") : t("homepage.closed")}
            </Text>
          </View>
        </View>
      </View>
      <View className="flex flex-row items-center px-4 py-3">
        <Text className="font-['hotel-resort'] text-black" numberOfLines={1}>
          {location.name}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default CardRest;
