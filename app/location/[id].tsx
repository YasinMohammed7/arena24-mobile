import { useLocalSearchParams, useRouter } from "expo-router";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, ArrowRight } from "lucide-react-native";
import MenuIcon from "@/assets/locations-icons/menu.svg";
import ServiceCard from "@/components/locations/ServiceCard";
import { useLocationsStore } from "@/zustand/locationsStore";
import { useServiceRequestStore } from "@/zustand/serviceRequestStore";
import { useAuthStore } from "@/zustand/authStore";
import { useEffect } from "react";
import { useLanguage } from "@/hooks/useLanguage";

const Location = () => {
  const { t } = useLanguage();
  const { id, tableNumber } = useLocalSearchParams<{
    id: string;
    tableNumber?: string;
  }>();
  const router = useRouter();

  const {
    selectedLocation: location,
    isLoadingDetail,
    errorDetail,
    fetchLocationById,
  } = useLocationsStore();

  const { initializeStore, clearAllTimers } = useServiceRequestStore();

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const setRedirectAfterLogin = useAuthStore(
    (state) => state.setRedirectAfterLogin
  );

  // Fetch location details and initialize store when component mounts
  useEffect(() => {
    if (id) {
      fetchLocationById(id);
    }
    initializeStore();
  }, [id, fetchLocationById, initializeStore]);

  useEffect(() => {
    return () => {
      clearAllTimers();
    };
  }, [clearAllTimers]);

  // Show loading state
  if (isLoadingDetail) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 items-center justify-center px-5">
          <ActivityIndicator size="large" color="#D38B5D" />
          <Text className="mt-4 font-['poppins-medium'] text-lg text-[#492800]">
            {t("locations.loadingDetails")}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Show error state
  if (errorDetail) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 items-center justify-center px-5">
          <Text className="mb-4 text-center text-xl font-bold text-[#492800]">
            {errorDetail}
          </Text>
          <TouchableOpacity
            className="rounded-full bg-[#D38B5D] px-6 py-3"
            onPress={() => router.back() ?? router.replace("/")}
          >
            <Text className="font-['poppins-medium'] text-lg text-white">
              {t("common.back")}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // If location not found, show error
  if (!location) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 items-center justify-center px-5">
          <Text className="mb-4 text-xl font-bold text-[#492800]">
            {t("locations.restaurantNotFound")}
          </Text>
          <TouchableOpacity
            className="rounded-full bg-[#D38B5D] px-6 py-3"
            onPress={() => router.back() ?? router.replace("/")}
          >
            <Text className="font-['poppins-medium'] text-lg text-white">
              {t("common.back")}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Restaurant Image */}
        <View className="relative">
          <Image
            source={{
              uri: location.imageUrl,
            }}
            className="h-44 w-full"
            resizeMode="cover"
          />

          {/* Header Overlay with Back Arrow */}
          <View className="absolute left-0 right-0 top-0 flex-row items-center justify-start px-5 pt-2">
            <TouchableOpacity
              onPress={() =>
                tableNumber ? router.replace(`/`) : router.back()
              }
              className="rounded-full bg-white/20 p-2"
            >
              <ArrowLeft size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <View className="absolute bottom-0 left-0 right-0 flex-row items-center justify-between py-3 pr-4">
            <View className="bg-[#492800] px-3 py-2">
              <Text className="font-['hotel-resort'] text-lg leading-5 text-white">
                {location.name}
              </Text>
              <Text className="mt-1 font-['poppins-medium'] text-xs text-white">
                {location.experience}
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => router.push(`/location/details/${id}`)}
              className="rounded-[54px] border border-[rgba(255,255,255,0.4)] bg-white/20 px-4 py-2"
            >
              <View className="flex-row items-center gap-2">
                <Text className="font-['poppins-medium'] text-base text-white">
                  {t("locations.details")}
                </Text>
                <ArrowRight size={20} color="#FFFFFF" />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Text Section */}
        <View className="px-5 py-4">
          <Text className="mb-2 font-['poppins-medium'] text-lg leading-6 text-[#492800]">
            {t("locations.whatCanWeDo")}
          </Text>
        </View>

        <View className="mx-5 mb-7">
          {/* Actions Row: Menu + Make a reservation */}
          <View className="flex-row items-center justify-center">
            <ServiceCard
              title={t("locations.menu")}
              icon={<MenuIcon />}
              onPress={() => {
                if (!isAuthenticated) {
                  setRedirectAfterLogin(`/location/${id}`);
                  router.push("/login");
                  return;
                }
                Linking.openURL(location.meniuUrl);
              }}
            />
          </View>

          {/* Amenities */}
          {location?.locationAmenities &&
            location.locationAmenities.length > 0 && (
              <View className="mt-5 gap-3">
                <Text className="font-['poppins-medium'] text-[#492800]">
                  {t("locations.detailsThatMatter")}
                </Text>
                {location.locationAmenities.map(
                  (amenity) =>
                    amenity.amenity.isActive && (
                      <View
                        key={amenity.id}
                        className="rounded-2xl border border-[#F1F1F1] bg-white p-3"
                      >
                        <Text className="font-['poppins-medium'] text-sm text-[#000000]">
                          {amenity.amenity.name}
                        </Text>
                        <Text className="mt-0.5 font-['poppins-light'] text-xs text-[#000000]">
                          {amenity.amenity.description}
                        </Text>
                      </View>
                    )
                )}
              </View>
            )}

          {/* Offers */}
          {location?.offers && location.offers.length > 0 && (
            <View className="mt-5">
              <Text className="mb-2 font-['poppins-medium'] text-[#492800]">
                {t("offers.specialOffers")}
              </Text>
              <View className="gap-3">
                {location.offers.map((offer) => (
                  <TouchableOpacity
                    key={offer.id}
                    onPress={() => router.push(`/offer/${offer.id}`)}
                    className="overflow-hidden rounded-[10px] border border-[#F1F1F1] bg-white"
                  >
                    {offer.image && (
                      <Image
                        source={{ uri: offer.image }}
                        className="h-32 w-full"
                        resizeMode="cover"
                      />
                    )}
                    <View className="px-4 py-3">
                      <Text className="font-['poppins-semibold'] text-sm text-[#492800]">
                        {offer.name}
                      </Text>
                      {offer.description && (
                        <Text className="mt-1 font-['poppins-light'] text-xs text-[#492800B2]">
                          {offer.description}
                        </Text>
                      )}
                      {offer.discount > 0 && (
                        <View className="mt-2 self-start rounded-full bg-[#D38B5D] px-3 py-1">
                          <Text className="font-['poppins-medium'] text-xs text-white">
                            -{offer.discount}%
                          </Text>
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Facilities */}
          {location?.locationFacilities &&
            location.locationFacilities.length > 0 && (
              <View className="mt-5">
                <Text className="mb-2 font-['poppins-medium'] text-[#492800]">
                  {t("locations.facilities")}
                </Text>
                <View className="flex-row flex-wrap gap-2">
                  {location.locationFacilities.map((facility) => (
                    <View
                      key={facility.id}
                      className="rounded-full bg-[rgba(211,139,93,0.15)] px-3 py-1"
                    >
                      <Text className="font-['poppins-medium'] text-xs text-[#925407]">
                        {facility.facility.name}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
        </View>
      </ScrollView>

      {/* Sticky Bottom Reservation
      <View className="border-t border-[#F1F1F1] bg-white px-5 py-3">
        <TouchableOpacity
          className="w-full flex-row items-center justify-center rounded-[54px] bg-[#D38B5D] px-4 py-3"
          onPress={() => {
            if (!isAuthenticated) {
              setRedirectAfterLogin("/action/location");
              router.push("/login");
              return;
            }
            const { setSelectedLocationId } = useLocationsStore.getState();
            setSelectedLocationId(location.id);
            router.push("/action/location");
          }}
        >
          <Text className="font-['poppins-medium'] text-base text-white">
            {t("locations.makeReservation")}
          </Text>
        </TouchableOpacity>
      </View>
      */}
    </SafeAreaView>
  );
};

export default Location;
