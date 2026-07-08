import { View, Text, Image, TouchableOpacity } from "react-native";
import { Href, useRouter } from "expo-router";
import LocationOutline from "@/assets/carouselIcons/location.svg";
import CalendarOutline from "@/assets/carouselIcons/calendar-outline.svg";
import Clock from "@/assets/carouselIcons/clock-brown.svg";
import PeopleIcon from "@/assets/carouselIcons/people-icon.svg";
import LineArrowRight from "@/assets/carouselIcons/line-arrow-right.svg";
import { EventType } from "@/types/events";
import { LocationDetail } from "@/types/locations";
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
    }
  );

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
      className="mb-5 w-full rounded-[10px] border border-[#F1F1F1] bg-white"
    >
      {/* Event Image + Badge */}
      <View className="relative mb-4">
        <Image
          key={`event-${event.id}-${overrideLocation?.id || "default"}`}
          source={{ uri: event.imageUrl }}
          className="min-h-48 w-full rounded-t-[10px]"
          resizeMode="cover"
        />
        <View className="absolute right-3 top-3 rounded-[23px] border border-[rgba(255,255,255,0.27)] bg-[rgba(255,248,231,0.16)] px-3 py-1.5">
          <Text className="text-m font-['Montserrat-SemiBold'] uppercase text-white">
            {event.price === "0"
              ? t("homepage.free")
              : event.price + " " + t(currencyKey)}
          </Text>
        </View>
      </View>
      {/* Event Name */}
      <Text className="ml-5 font-['hotelResort'] text-xl font-bold text-[#492800]">
        {event.name}
      </Text>

      {/* Timer */}

      {/* Location Row */}
      <View className="mb-4 ml-5 flex-row items-center gap-1">
        <LocationOutline width={16} height={16} />
        <Text className="text-s font-['poppins-light'] text-[rgba(73,40,0,0.7)]">
          {locationName}
        </Text>
      </View>
      {/* Info Row */}
      <View className="mb-2 flex-row items-center gap-6">
        {/* Date */}
        <View className="ml-5 flex-row items-center gap-1">
          <CalendarOutline />
          <Text className="text-s mt-1 font-['poppins-light'] text-[rgba(73,40,0,0.7)]">
            {formattedDate}
          </Text>
        </View>
        {/* Time */}
        <View className="flex-row items-center gap-1">
          <Clock />
          <Text className="text-s mt-1 font-['poppins-light'] text-[rgba(73,40,0,0.7)]">
            {formattedStartHour}
          </Text>
        </View>
        {/* Participants */}
        <View className="flex-row items-center gap-1">
          <PeopleIcon />
          <Text className="text-s mt-1 font-['poppins-light'] text-[rgba(73,40,0,0.7)]">
            {event.maxPeople ?? "N/A"}
          </Text>
        </View>
      </View>

      {/* <View className="m-4">
        <EventTimer eventDate={new Date(event.date)} />
      </View> */}

      {/* Button */}
      <TouchableOpacity
        className="m-4 flex-row items-center justify-center gap-2 rounded-full bg-[#D38B5D] px-5 py-2"
        onPress={handleEventPress}
      >
        <Text className="font-['poppins-medium'] text-lg text-white">
          {t("homepage.learnMore")}
        </Text>
        <LineArrowRight color="#fff" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}
