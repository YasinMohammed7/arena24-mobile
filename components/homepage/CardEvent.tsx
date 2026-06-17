import { View, Text, Image, TouchableOpacity, Platform } from "react-native";
import { Href, useRouter } from "expo-router";
import LocationOutline from "@/assets/carouselIcons/location.svg";
import CalendarOutline from "@/assets/carouselIcons/calendar-outline.svg";
import Clock from "@/assets/carouselIcons/clock-brown.svg";
import PeopleIcon from "@/assets/carouselIcons/people-icon.svg";
import LineArrowRight from "@/assets/carouselIcons/line-arrow-right.svg";
import { EventType } from "@/types/events";
import { LocationDetail } from "@/types/locations";
import EventTimer from "./EventTimer";
import { useLanguage } from "@/hooks/useLanguage";

interface CardEventProps {
  event: EventType | any;
  overrideLocation?: LocationDetail | null;
}

export default function CardEvent({ event, overrideLocation }: CardEventProps) {
  const router = useRouter();
  const { t, getLocale, currentLanguage } = useLanguage();
  const locale = getLocale();

  const formattedDate = new Date(event.date).toLocaleDateString(locale, {
    day: "2-digit",
    month: "long",
  });
  const formattedStartHour = new Date(event.startHour).toLocaleTimeString(
    locale,
    {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "UTC",
    }
  );
  const formattedEndHour = new Date(event.endHour).toLocaleTimeString(locale, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "UTC",
  });

  // Use override location if provided, otherwise use event location
  const locationName =
    overrideLocation?.name ||
    event.location?.name ||
    t("locations.locationUnavailable");

  const handleEventPress = () => {
    router.push(`/events/${event.id}` as Href);
  };

  const currencyKey =
    currentLanguage === "de" ? "currency.eur" : "currency.ron";

  return (
    <TouchableOpacity
      onPress={handleEventPress}
      className="bg-white mb-5 border border-[#F1F1F1] rounded-[10px] w-full"
    >
      {/* Event Image + Badge */}
      <View className="relative mb-4">
        <Image
          key={`event-${event.id}-${overrideLocation?.id || "default"}`}
          source={{ uri: event.imageUrl }}
          className="w-full min-h-48 rounded-t-[10px]"
          resizeMode="cover"
        />
        <View className="absolute right-3 top-3 bg-[rgba(255,248,231,0.16)] border border-[rgba(255,255,255,0.27)] rounded-[23px] px-3 py-1.5">
          <Text className="text-white font-['Montserrat-SemiBold'] text-m uppercase">
            {event.price === "0"
              ? t("homepage.free")
              : event.price + " " + t(currencyKey)}
          </Text>
        </View>
      </View>
      {/* Event Name */}
      <Text className="font-['hotelResort'] text-xl font-bold text-[#492800] ml-5">
        {event.name}
      </Text>

      {/* Timer */}

      {/* Location Row */}
      <View className="flex-row items-center gap-1 mb-4 ml-5">
        <LocationOutline width={16} height={16} />
        <Text className="font-['poppins-light'] text-s text-[rgba(73,40,0,0.7)]">
          {locationName}
        </Text>
      </View>
      {/* Info Row */}
      <View className="flex-row items-center gap-6 mb-2">
        {/* Date */}
        <View className="flex-row items-center gap-1 ml-5">
          <CalendarOutline />
          <Text className="font-['poppins-light'] mt-1 text-s text-[rgba(73,40,0,0.7)]">
            {formattedDate}
          </Text>
        </View>
        {/* Time */}
        <View className="flex-row items-center gap-1">
          <Clock />
          <Text className="font-['poppins-light'] mt-1 text-s text-[rgba(73,40,0,0.7)]">
            {formattedStartHour}
          </Text>
        </View>
        {/* Participants */}
        <View className="flex-row items-center gap-1">
          <PeopleIcon />
          <Text className="font-['poppins-light'] mt-1 text-s text-[rgba(73,40,0,0.7)]">
            {event.maxPeople ?? "N/A"}
          </Text>
        </View>
      </View>

      {/* <View className="m-4">
        <EventTimer eventDate={new Date(event.date)} />
      </View> */}

      {/* Button */}
      <TouchableOpacity
        className="flex-row items-center justify-center bg-[#D38B5D] rounded-full m-4 px-5 py-2 gap-2"
        onPress={handleEventPress}
      >
        <Text className="text-white font-['poppins-medium'] text-lg">
          {t("homepage.learnMore")}
        </Text>
        <LineArrowRight color="#fff" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}
