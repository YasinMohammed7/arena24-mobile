import {
  Alert,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { LocationDetail } from "@/types/locations";
import { Copy, Phone, Calendar, Info, Home } from "lucide-react-native";
import Clipboard from "@react-native-clipboard/clipboard";
import LocationOutline from "@/assets/carouselIcons/location.svg";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLanguage } from "@/hooks/useLanguage";

interface DetailsTabProps {
  location: LocationDetail | null;
}

export default function DetailsTab({ location }: DetailsTabProps) {
  const { t } = useLanguage();

  // Trim seconds from time string: "09:00:00" → "09:00"
  const trimTime = (time: string): string =>
    time.split(":").slice(0, 2).join(":");

  // Map numeric dayOfWeek (1=Monday ... 7=Sunday) to i18n translation keys
  const getDayKey = (day: number): string => {
    const dayMap: Record<number, string> = {
      1: "monday",
      2: "tuesday",
      3: "wednesday",
      4: "thursday",
      5: "friday",
      6: "saturday",
      7: "sunday",
    };
    return dayMap[day] || "monday";
  };
  const copyAddressToClipboard = () => {
    if (location?.address) {
      try {
        Clipboard.setString(location?.address);
      } catch (error) {
        console.error("Error copying address to clipboard:", error);
        Alert.alert(t("reservations.error"), t("locations.addressCopyError"));
      }
    }
  };
  return (
    <SafeAreaView edges={["left", "right"]} className="flex-1 bg-white py-6">
      <ScrollView className="flex-1 bg-white">
        <View className="mt-4 flex-row items-center justify-between">
          <View className="flex-1 flex-row items-center gap-2 pr-5">
            <LocationOutline />
            <Text className="font-['poppins-light'] text-sm text-[rgba(73,40,0,0.7)]">
              {location?.address}
            </Text>
          </View>
          <TouchableOpacity onPress={copyAddressToClipboard} className="p-1">
            <Copy size={16} color="rgba(73,40,0,0.7)" />
          </TouchableOpacity>
        </View>

        {/* Telefon Section */}
        <View className="mt-5 flex-row gap-2">
          <View className="mt-0.7">
            <Phone size={16} color="#492800" />
          </View>
          <View className="flex-col justify-center">
            <Text className="font-['poppins-medium'] text-sm text-[#492800]">
              {t("locations.phone")}
            </Text>
            <Text className="font-['poppins-light'] text-sm text-[rgba(73,40,0,0.7)]">
              {location?.contact || ""}
            </Text>
          </View>
        </View>

        {/* Program Section */}
        <View className="mt-5 flex-row items-start gap-2">
          <View className="mt-0.7">
            <Calendar size={16} color="#492800" />
          </View>
          <View className="flex-col justify-center gap-1">
            <Text className="font-['poppins-medium'] text-sm text-[#492800]">
              {t("locations.schedule")}
            </Text>
            {location?.schedules && location.schedules.length > 0 ? (
              location.schedules.map((scheduleItem, index) => (
                <Text
                  key={index}
                  className="font-['poppins-light'] text-sm text-[rgba(73,40,0,0.7)]"
                >
                  {t("weekdays." + getDayKey(scheduleItem.dayOfWeek))}:{" "}
                  {trimTime(scheduleItem.startTime)} -{" "}
                  {trimTime(scheduleItem.endTime)}
                </Text>
              ))
            ) : (
              <>
                <Text className="font-['poppins-light'] text-sm text-[rgba(73,40,0,0.7)]">
                  {t("locations.defaultScheduleMF")}
                </Text>
                <Text className="font-['poppins-light'] text-sm text-[rgba(73,40,0,0.7)]">
                  {t("locations.defaultScheduleSat")}
                </Text>
                <Text className="font-['poppins-light'] text-sm text-[rgba(73,40,0,0.7)]">
                  {t("locations.defaultScheduleSun")}
                </Text>
              </>
            )}
          </View>
        </View>

        {/* Facilitati Section */}
        <View className="mt-5 flex-1 flex-row items-start gap-2">
          <View className="mt-0.7">
            <Home size={16} color="#492800" />
          </View>
          <View className="flex-1 flex-col justify-center gap-1">
            <Text className="font-['poppins-medium'] text-sm text-[#492800]">
              {t("locations.facilities")}
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {location?.locationFacilities &&
              location.locationFacilities.length > 0 ? (
                location.locationFacilities.map((facility, index) => (
                  <View
                    key={index}
                    className="rounded-full bg-[rgba(211,139,93,0.15)] px-3 py-1"
                  >
                    <Text className="font-['poppins-medium'] text-xs text-[#925407]">
                      {facility.facility.name}
                    </Text>
                  </View>
                ))
              ) : (
                <>
                  <View className="rounded-full bg-[rgba(211,139,93,0.15)] px-3 py-1">
                    <Text className="font-['poppins-medium'] text-xs text-[#925407]">
                      {t("locations.terrace")}
                    </Text>
                  </View>
                  <View className="rounded-full bg-[rgba(211,139,93,0.15)] px-3 py-1">
                    <Text className="font-['poppins-medium'] text-xs text-[#925407]">
                      {t("locations.parking")}
                    </Text>
                  </View>
                  <View className="rounded-full bg-[rgba(211,139,93,0.15)] px-3 py-1">
                    <Text className="font-['poppins-medium'] text-xs text-[#925407]">
                      {t("locations.liveMusic")}
                    </Text>
                  </View>
                  <View className="rounded-full bg-[rgba(211,139,93,0.15)] px-3 py-1">
                    <Text className="font-['poppins-medium'] text-xs text-[#925407]">
                      {t("locations.privateDining")}
                    </Text>
                  </View>
                  <View className="rounded-full bg-[rgba(211,139,93,0.15)] px-3 py-1">
                    <Text className="font-['poppins-medium'] text-xs text-[#925407]">
                      {t("locations.veganDishes")}
                    </Text>
                  </View>
                </>
              )}
            </View>
          </View>
        </View>

        {/* Despre Restaurant Section */}
        <View className="mb-6 mt-5 flex-row items-start gap-2">
          <View className="mt-0.7">
            <Info size={16} color="#492800" />
          </View>
          <View className="flex-1 flex-col justify-center gap-1">
            <Text className="font-['poppins-medium'] text-sm text-[#492800]">
              {t("locations.aboutRestaurant")}
            </Text>
            <Text className="font-['poppins-light'] text-sm leading-6 text-[rgba(73,40,0,0.7)]">
              {location?.description ||
                "Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas."}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
