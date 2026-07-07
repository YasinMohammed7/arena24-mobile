import { useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Platform,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Header from "@/components/homepage/Header";
import LineArrowRight from "@/assets/carouselIcons/line-arrow-right.svg";
import "../../global.css";
import CardRest from "@/components/homepage/CardRest";
import CardEvent from "@/components/homepage/CardEvent";
import { useAuthStore } from "@/zustand/authStore";
import { useLocationsStore } from "@/zustand/locationsStore";
import { EventType } from "@/types/events";
import { useEventsStore } from "@/zustand/eventsStore";
import { useRefresh } from "@/hooks/useRefresh";
import { useLanguage } from "@/hooks/useLanguage";

export default function HomeScreen() {
  const { width } = useWindowDimensions();
  const { t } = useLanguage();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { locations, isLoading, error, fetchLocations, clearLocations } =
    useLocationsStore();
  const {
    events,
    isLoading: eventsLoading,
    error: eventsError,
    fetchEvents,
    clearEvents,
  } = useEventsStore();

  const { refreshing, onRefresh } = useRefresh({
    onRefresh: async () => {
      await Promise.all([fetchLocations(), fetchEvents()]);
    },
  });

  useEffect(() => {
    fetchLocations();
    fetchEvents();
  }, [fetchLocations, fetchEvents]);

  useEffect(() => {
    if (!isAuthenticated) {
      clearLocations();
      clearEvents();
      fetchLocations();
      fetchEvents();
    } else {
      fetchLocations();
      fetchEvents();
    }
  }, [
    isAuthenticated,
    clearLocations,
    clearEvents,
    fetchLocations,
    fetchEvents,
  ]);

  if (width === 0) return null;

  return (
    <SafeAreaView
      className="flex-1 bg-[#FEFEFE]"
      edges={["top", "left", "right"]}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#D38B5D"
            colors={["#D38B5D"]}
          />
        }
      >
        <Header
          title={
            user?.name
              ? t("homepage.welcomeUser", { name: user?.name })
              : t("homepage.welcome")
          }
          description={t("homepage.discoverRestaurants")}
          paddingX="px-5 pt-2"
          imgSrc={user?.imageUrl ?? ""}
        />

        <View className="px-5">
          <View className="flex-row items-center justify-between">
            <Text
              className={`font-['poppins-medium'] text-lg leading-none text-[#492800] ${
                Platform.OS === "ios" ? "pt-3" : ""
              }`}
            >
              {t("homepage.ourLocations")}
            </Text>
            <TouchableOpacity
              onPress={() =>
                router.push("/(navigationBar)/(locations)/locationsList")
              }
            >
              <LineArrowRight color="#99621E" />
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="py-3"
          >
            {isLoading ? (
              <View className="flex-row items-center px-2 py-4">
                <ActivityIndicator size="small" color="#99621E" />
                <Text className="ml-2 font-['poppins-regular'] text-sm text-[#99621E]">
                  {t("homepage.loadingLocations")}
                </Text>
              </View>
            ) : error ? (
              <Text className="py-4 font-['poppins-regular'] text-sm text-red-500">
                {error}
              </Text>
            ) : (
              locations.map((location) => (
                <CardRest key={location.id} location={location} />
              ))
            )}
          </ScrollView>
        </View>

        <View className="mt-5 rounded-t-[36px] border-l border-r border-t border-[#F1F1F1] px-5">
          <Header
            title={t("homepage.events")}
            description={t("homepage.discoverExperiences")}
            paddingTop="pt-6"
            paddingX="px-2"
          />
          {eventsLoading ? (
            <View className="flex-row items-center px-2 py-4">
              <ActivityIndicator size="small" color="#99621E" />
              <Text className="ml-2 font-['poppins-regular'] text-sm text-[#99621E]">
                {t("homepage.loadingEvents")}
              </Text>
            </View>
          ) : eventsError ? (
            <Text className="py-4 font-['poppins-regular'] text-sm text-red-500">
              {eventsError}
            </Text>
          ) : (
            <FlatList
              data={events}
              keyExtractor={(item: EventType) => item.id.toString()}
              renderItem={({ item }) => <CardEvent event={item} />}
              showsVerticalScrollIndicator={false}
              scrollEnabled={false}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
