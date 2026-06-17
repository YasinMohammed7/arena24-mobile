import { View, Text, Image, TouchableOpacity } from "react-native";
import LocationIcon from "@/assets/navigationIcons/location-outline.svg";
import CalendarIcon from "@/assets/offers-icons/calendar-offers.svg";
// import StarIcon from "@/assets/carouselIcons/star.svg";
import { offersItemCore } from "@/types/offers";
import { useRouter } from "expo-router";
import { useLanguage } from "@/hooks/useLanguage";

export default function OfferCard({ offer }: { offer: offersItemCore }) {
  const router = useRouter();
  const { getLocale } = useLanguage();
  const locale = getLocale();

  const formattedStartDate = new Date(offer.startDate).toLocaleDateString(
    locale,
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
  const formattedEndDate = new Date(offer.endDate).toLocaleDateString(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <TouchableOpacity
      onPress={() => router.push(`/offer/${offer.id}`)}
      className="border border-[#F1F1F1] rounded-[10px] w-full"
    >
      {/* Banner Image with Discount Badges */}
      <View className="relative h-[166px]">
        <Image
          source={
            offer.image
              ? { uri: offer.image }
              : require("@/assets/android_icon.jpg")
          }
          className="w-full h-48 rounded-t-[10px]"
          resizeMode="cover"
        />
      </View>

      {/* Content */}
      <View className="px-4 py-3">
        {/* Title */}
        <Text className="font-['poppins-semibold']">{offer.name}</Text>

        {/* Location */}
        <View className="flex-row items-center gap-1 mb-1">
          <LocationIcon width={14} height={14} color="#99621E" />
          <Text className="font-['poppins-regular'] text-sm text-[#99621E]">
            {offer.location.name}
          </Text>
        </View>

        {/* Bottom Row - Date Badge and Rating */}
        <View className="flex-row items-center justify-end">
          {/* <View className="flex-row items-center gap-1">
            <StarIcon color="#492800" />
            <Text className="font-['Montserrat'] font-medium text-sm text-[#492800] uppercase">
              {offer.rating}
            </Text>
          </View> */}
          {/* Date Badge */}
          <View className="flex-row items-center justify-center bg-[rgba(211,139,93,0.15)] border border-[rgba(211,139,93,0.29)] rounded-[20px] px-3 py-1 gap-2">
            <CalendarIcon />
            <Text className="font-['poppins-regular'] text-xs text-[#99621E]">
              {formattedStartDate} - {formattedEndDate}
            </Text>
          </View>

          {/* Rating */}
        </View>
      </View>
    </TouchableOpacity>
  );
}
