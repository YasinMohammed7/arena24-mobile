import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Platform,
  Linking,
  Alert,
  ActionSheetIOS,
} from "react-native";
import { useState, useEffect } from "react";
import { Copy } from "lucide-react-native";
import LocationOutline from "@/assets/carouselIcons/location.svg";
import Clock from "@/assets/carouselIcons/clock-brown.svg";
import PhoneIcon from "@/assets/locations-icons/phone.svg";
import GpsIcon from "@/assets/locations-icons/gps.svg";
import { MapApp } from "@/types/mapTypes";
import { Href, useRouter } from "expo-router";
import { LocationListItem } from "@/types/locations";
import { checkScheduleAndOpenStatus } from "@/utils/scheduleUtils";
import Clipboard from "@react-native-clipboard/clipboard";
import { useLanguage } from "@/hooks/useLanguage";

export default function CardRestaurant({
  id,
  name,
  address,
  schedules,
  experience,
  contact,
  imageUrl,
  isActive,
  locationFacilities,
}: LocationListItem) {
  const router = useRouter();
  const { t } = useLanguage();
  const [currentSchedule, setCurrentSchedule] = useState(
    () => checkScheduleAndOpenStatus(schedules).currentSchedule
  );

  useEffect(() => {
    const update = () =>
      setCurrentSchedule(checkScheduleAndOpenStatus(schedules).currentSchedule);

    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, [schedules]);

  const copyAddressToClipboard = () => {
    if (address) {
      try {
        Clipboard.setString(address);
        Alert.alert(t("common.success"), t("locations.addressCopied"));
      } catch (error) {
        console.error("Error copying address to clipboard:", error);
        Alert.alert(
          t("reservations.error"),
          t("locations.couldNotCopyAddress")
        );
      }
    }
  };

  const openMapsApp = async () => {
    if (!address) {
      Alert.alert(t("reservations.error"), t("locations.noAddressAvailable"));
      return;
    }

    try {
      if (Platform.OS === "ios") {
        // iOS: Create a custom action sheet with map apps
        const query = encodeURIComponent(address);

        const mapOptions: MapApp[] = [
          {
            name: t("locations.openInAppleMaps"),
            url: `http://maps.apple.com/?q=${query}`,
          },
          {
            name: t("locations.openInGoogleMaps"),
            url: `https://maps.google.com/maps?q=${query}`,
          },
          {
            name: t("locations.openInWaze"),
            url: `waze://?q=${query}`,
          },
          {
            name: t("locations.openInUber"),
            url: `https://m.uber.com/ul/?action=setPickup&pickup=my_location&dropoff[formatted_address]=${query}`,
          },
          { name: t("common.cancel"), url: null },
        ];

        // Check which apps are available
        const availableApps: MapApp[] = [];
        for (const app of mapOptions) {
          if (app.url) {
            try {
              const supported = await Linking.canOpenURL(app.url);
              if (supported) {
                availableApps.push(app);
              }
            } catch (error) {
              console.error(
                `Error checking availability for ${app.name}:`,
                error
              );
              console.log(`${app.name} not available`);
            }
          } else {
            availableApps.push(app); // Add Cancel option
          }
        }

        if (availableApps.length > 1) {
          ActionSheetIOS.showActionSheetWithOptions(
            {
              options: availableApps.map((app) => app.name),
              cancelButtonIndex: availableApps.length - 1,
              title: name || t("locations.restaurant"),
              message: t("locations.chooseApp"),
            },
            (buttonIndex) => {
              if (buttonIndex < availableApps.length - 1) {
                const selectedApp = availableApps[buttonIndex];
                if (selectedApp.url) {
                  Linking.openURL(selectedApp.url);
                }
              }
            }
          );
        } else {
          // Fallback to generic URL
          const genericUrl = `https://maps.google.com/maps?q=${query}`;
          const supported = await Linking.canOpenURL(genericUrl);
          if (supported) {
            await Linking.openURL(genericUrl);
          }
        }
      } else {
        // Android: Use geo scheme that works well for app chooser
        const androidMapUrl = `geo:0,0?q=${encodeURIComponent(address)}`;

        try {
          const supported = await Linking.canOpenURL(androidMapUrl);
          if (supported) {
            await Linking.openURL(androidMapUrl);
            return;
          }
        } catch (error) {
          console.log("Geo scheme failed, trying alternative", error);
        }

        // Android fallback
        const fallbackUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          address
        )}`;
        const supported = await Linking.canOpenURL(fallbackUrl);
        if (supported) {
          await Linking.openURL(fallbackUrl);
          return;
        }
      }
    } catch (error) {
      console.error("Error opening map:", error);
      Alert.alert(t("reservations.error"), t("locations.couldNotOpenMapsApp"));
    }
  };

  return (
    <TouchableOpacity
      onPress={() => {
        id && router.push(`/location/${id}` as Href);
      }}
      className={`mb-5 w-full rounded-[10px] border border-[#F1F1F1] bg-white ${
        Platform.OS === "android" ? "shadow-md" : ""
      }`}
    >
      {/* Restaurant Image + Rating Badge */}
      <View className="relative mb-4">
        <Image
          source={{ uri: imageUrl ?? "" }}
          className="h-48 w-full rounded-t-[10px]"
          resizeMode="cover"
        />
        {/* <View className="absolute right-3 top-3 bg-[rgba(255,248,231,0.16)] border border-[rgba(255,255,255,0.27)] rounded-[23px] px-3 py-1.5 flex-row items-center gap-1">
          <Star width={12} height={12} color="#fff" />
          <Text className="text-white font-['Montserrat-SemiBold'] text-sm">
            {rating}
          </Text>
        </View> */}
      </View>

      {/* Restaurant Name */}
      <Text className="mb-1 ml-5 font-['hotelResort'] text-xl font-bold text-[#492800]">
        {name}
      </Text>

      {/* Category + Distance */}
      <View className="mb-3 ml-5 mr-5 flex-row items-center justify-between">
        <Text className="font-['poppins-light'] text-sm text-[rgba(73,40,0,0.7)]">
          {experience}
        </Text>
        {/* <Text className="font-['poppins-medium'] text-sm text-[#492800]">
          {distance}
        </Text> */}
      </View>

      {/* Address Row */}
      <View className="mb-2 ml-5 mr-5 flex-row items-center justify-between">
        <View className="flex-1 flex-row items-center gap-2">
          <LocationOutline width={16} height={16} />
          <Text className="flex-1 font-['poppins-light'] text-sm text-[rgba(73,40,0,0.7)]">
            {address}
          </Text>
        </View>
        <TouchableOpacity onPress={copyAddressToClipboard} className="p-1">
          <Copy size={16} color="rgba(73,40,0,0.7)" />
        </TouchableOpacity>
      </View>

      {/* Hours Row */}
      <View className="mb-2 ml-5 flex-row items-center gap-2">
        <Clock width={16} height={16} />
        <Text className="font-['poppins-light'] text-sm text-[rgba(73,40,0,0.7)]">
          {t("locations.openSchedule", { schedule: currentSchedule })}
        </Text>
      </View>

      {/* Phone Row */}
      <View className="mb-3 ml-5 flex-row items-center gap-2">
        <PhoneIcon width={16} height={16} />
        <Text className="font-['poppins-light'] text-sm text-[rgba(73,40,0,0.7)]">
          {contact}
        </Text>
      </View>

      {/* Tags */}
      <View className="mb-4 ml-5 mr-5 flex-row flex-wrap gap-2">
        {locationFacilities?.map((tag, index) => (
          <View key={index} className="rounded-full bg-[#D38B5D36] px-3 py-1">
            <Text className="font-['poppins-medium'] text-xs text-[#99621E]">
              {tag.facility.name}
            </Text>
          </View>
        ))}
      </View>

      {/* Buttons */}
      <View className="m-4 flex-row gap-3">
        <TouchableOpacity
          className="flex-1 flex-row items-center justify-center gap-2 rounded-full border border-[#EEEEEE] bg-transparent py-3"
          onPress={openMapsApp}
        >
          <GpsIcon width={16} height={16} />
          <Text className="font-['poppins-medium'] text-lg text-[#99621E]">
            {t("locations.location")}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            id && router.push(`/location/${id}` as Href);
          }}
          className="flex-1 items-center rounded-full bg-[#D38B5D] py-3"
        >
          <Text className="font-['poppins-medium'] text-lg text-white">
            {t("locations.choose")}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}
