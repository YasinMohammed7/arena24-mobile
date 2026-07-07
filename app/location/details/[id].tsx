import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Share,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocationsStore } from "@/zustand/locationsStore";
import { createMaterialTopTabNavigator } from "expo-router/js-top-tabs";
import DetailsTab from "@/components/locations/DetailsTab";
import { ArrowLeft, Share as ShareIcon } from "lucide-react-native";
import EventTab from "@/components/locations/EventTab";
import GalleryTab from "@/components/locations/GalleryTab";
import { useLanguage } from "@/hooks/useLanguage";
const Tab = createMaterialTopTabNavigator();
export default function LocationDetails() {
  const { t } = useLanguage();
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const {
    selectedLocation: location,
    isLoadingDetails,
    fetchLocationDetails,
  } = useLocationsStore();

  useEffect(() => {
    if (id) {
      fetchLocationDetails(id);
    }
  }, [id, fetchLocationDetails]);

  // Defined components to avoid inline functions
  const DetailsScreen = useMemo(
    () =>
      Object.assign(() => <DetailsTab location={location} />, {
        displayName: "DetailsScreen",
      }),
    [location]
  );

  const EventsScreen = useMemo(
    () =>
      Object.assign(() => <EventTab location={location} />, {
        displayName: "EventsScreen",
      }),
    [location]
  );

  const GalleryScreen = useMemo(
    () =>
      Object.assign(() => <GalleryTab location={location} />, {
        displayName: "GalleryScreen",
      }),
    [location]
  );

  if (isLoadingDetails) {
    return (
      <SafeAreaView
        edges={["top", "left", "right"]}
        className="flex-1 bg-white"
      >
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#D38B5D" />
          <Text className="mt-4 font-['poppins-medium'] text-lg text-[#492800]">
            {t("locations.loadingLocationDetails")}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const onShare = async () => {
    try {
      // Web URL for sharing
      const link = `https://arena-24.expo.app/location/details/${location?.id}`;

      await Share.share({
        message: `${t("locations.shareMessage")} ${link}`,
      });
    } catch (err) {
      console.error("Share failed:", err);
    }
  };

  return (
    <SafeAreaView
      edges={["top", "left", "right"]}
      className="flex-1 bg-white px-5"
    >
      {/* Header */}
      <View className="relative items-center justify-center py-4">
        {/* Back Button - Absolute Left */}
        <TouchableOpacity
          onPress={() => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.push("/");
            }
          }}
          className="absolute left-0 z-10 flex-row items-center rounded-[30px] bg-[#49280008] p-2"
          style={{ backgroundColor: "rgba(73, 40, 0, 0.05)" }}
        >
          <ArrowLeft size={20} color="#492800" strokeWidth={2} />
        </TouchableOpacity>

        {/* Location Name - Centered */}
        <Text className="text-center font-['hotel-resort'] text-lg text-[#492800]">
          {location?.name || t("locations.locationLabel")}
        </Text>

        {/* Action Icons - Absolute Right */}
        <View className="absolute right-0 z-10 flex-row gap-4">
          {/* <TouchableOpacity>
            <Heart size={20} color="#492800" strokeWidth={1.5} />
          </TouchableOpacity> */}
          <TouchableOpacity
            onPress={() => {
              onShare();
            }}
          >
            <ShareIcon size={20} color="#492800" strokeWidth={1.5} />
          </TouchableOpacity>
        </View>
      </View>

      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: "#492800",
          tabBarInactiveTintColor: "#000",
          tabBarLabelStyle: {
            fontSize: 12,
            fontFamily: "poppins-medium",
            textTransform: "none",
          },
          tabBarStyle: {
            backgroundColor: "white",
            elevation: 4,
            shadowOpacity: 0.1,
          },
          tabBarIndicatorStyle: {
            backgroundColor: "#D38B5D",
            height: 3,
          },
        }}
      >
        <Tab.Screen
          name="Details"
          component={DetailsScreen}
          options={{ tabBarLabel: t("locations.details") }}
        />
        <Tab.Screen
          name="Events"
          component={EventsScreen}
          options={{ tabBarLabel: t("locations.events") }}
        />
        <Tab.Screen
          name="Gallery"
          component={GalleryScreen}
          options={{ tabBarLabel: t("locations.gallery") }}
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
}
