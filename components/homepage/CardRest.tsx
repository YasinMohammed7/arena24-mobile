import { View, Text, Pressable, Image, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";
import { BlurView } from "expo-blur";
import StarIcon from "@/assets/carouselIcons/star.svg";
import ClockIcon from "@/assets/carouselIcons/clock.svg";
import { Href, router } from "expo-router";
import { LocationListItem } from "@/types/locations";
import { useLanguage } from "@/hooks/useLanguage";
import { checkScheduleAndOpenStatus } from "@/utils/scheduleUtils";

const CardRest = ({ location }: { location: LocationListItem }) => {
  const { t } = useLanguage();
  const [isCurrentlyOpen, setIsCurrentlyOpen] = useState(false);
  const [currentSchedule, setCurrentSchedule] = useState<string>("");

  const imageSrc = location.imageUrl || "";

  // Function to update schedule and open status
  const updateScheduleStatus = (): void => {
    const { isCurrentlyOpen, currentSchedule } = checkScheduleAndOpenStatus(
      location.schedule
    );
    setIsCurrentlyOpen(isCurrentlyOpen);
    setCurrentSchedule(currentSchedule);
  };

  useEffect(() => {
    updateScheduleStatus();
    // Update every minute
    const interval = setInterval(updateScheduleStatus, 60000);
    return () => clearInterval(interval);
  }, [location.schedule]);

  return (
    <TouchableOpacity
      onPress={() => router.push(`/location/${location.id}` as Href)}
      className="w-84 h-58 rounded-[10px] border border-[#F1F1F1] mr-4 bg-white overflow-hidden shadow-[0px_4px_9.4px_0px_rgba(0,0,0,0.16)]"
    >
      <View className="relative">
        <Image
          source={{ uri: imageSrc ?? "" }}
          className="w-[248px] h-[148px] rounded-t-[10px]"
          resizeMode="cover"
        />
        {/* <BlurView
          // intensity={70}
          // tint="light"
          className="w-[51px] bg-[rgba(255,248,231,0.16)] h-[25px] top-[10px] left-[189px] rounded-[23px] absolute overflow-hidden"
        >
          <Pressable className="flex flex-row items-center gap-1 w-full h-full rounded-[23px] border border-[#FFFFFF45] pt-1 pr-[6px] pb-1 pl-[6px] bg-[rgba(255,248,231,0.16)]">
            <StarIcon color="#fff" />
            <Text className="text-[#fff] font-['poppins-regular'] text-sm">
              {location.rating}
            </Text>
          </Pressable>
        </BlurView> */}
        <BlurView className="min-w-[115px] min-h-[48px] top-[85px] left-[8px] rounded-[11px] border border-[#FFFFFF45] pt-[4px] pr-[10px] pb-[6px] pl-[8px] absolute bg-[rgba(255,248,231,0.16)] overflow-hidden">
          <View className="flex flex-row items-center justify-start gap-1 text-[#fff] font-['poppins-regular'] text-sm">
            <ClockIcon />
            <Text className="text-[#fff] font-['poppins-regular'] text-sm">
              {currentSchedule}
            </Text>
          </View>
          <View className="flex flex-row items-center gap-1 pl-1">
            <View
              className={`w-[6px] h-[6px] rounded-[11px] ${
                isCurrentlyOpen ? "bg-[#97F59D]" : "bg-[#FF6B6B]"
              }`}
            ></View>
            <Text className="text-[#fff] font-['poppins-regular'] text-sm">
              {isCurrentlyOpen ? t("homepage.open") : t("homepage.closed")}
            </Text>
          </View>
        </BlurView>
      </View>
      <View className="flex flex-row justify-between items-center gap-2 px-4 py-3">
        <Text className="text-black font-['hotel-resort']" numberOfLines={1}>
          {location.name}
        </Text>
        {/* <Text className="text-[#99621E] font-['poppins-regular'] text-xs">
          {location.distance}
        </Text> */}
      </View>
    </TouchableOpacity>
  );
};

export default CardRest;
