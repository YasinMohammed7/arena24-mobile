import { useLocalSearchParams, useRouter } from "expo-router";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import { ArrowLeft, ArrowRight, QrCode } from "lucide-react-native";
import MenuIcon from "@/assets/locations-icons/menu.svg";
import WaiterIcon from "@/assets/locations-icons/waiter.svg";
import BillIcon from "@/assets/locations-icons/bill.svg";
import ServiceCard from "@/components/locations/ServiceCard";
import { useLocationsStore } from "@/zustand/locationsStore";
import { useServiceRequestStore } from "@/zustand/serviceRequestStore";
import { useAuthStore } from "@/zustand/authStore";
import { useEffect, useState } from "react";
import AmenityModal from "@/components/modals/AmenityModal";
import AmenityCard from "@/components/locations/AmenityCard";
import Button from "@/components/shared/Button";
import { useCameraPermissions } from "expo-camera";
import { useLanguage } from "@/hooks/useLanguage";

const Location = () => {
  const { t } = useLanguage();
  const { id, tableNumber } = useLocalSearchParams<{
    id: string;
    tableNumber?: string;
  }>();
  const router = useRouter();
  const [isWaiterModalVisible, setIsWaiterModalVisible] = useState(false);
  const [isBillModalVisible, setIsBillModalVisible] = useState(false);
  // State for amenity modals - keyed by amenity ID
  const [amenityModalStates, setAmenityModalStates] = useState<{
    [key: number]: boolean;
  }>({});

  const [permission, requestPermission] = useCameraPermissions();

  // Helper functions for amenity modal state management
  const setAmenityModalVisible = (amenityId: number, visible: boolean) => {
    setAmenityModalStates((prev) => ({ ...prev, [amenityId]: visible }));
  };

  const isAmenityModalVisible = (amenityId: number) =>
    amenityModalStates[amenityId] || false;

  // QR Scanner permission request
  const handleQRScanPress = async () => {
    console.log("QR Button pressed");

    if (!isAuthenticated) {
      setRedirectAfterLogin(`/location/${id}`);
      router.push("/login");
      return;
    }

    if (!permission) {
      return;
    }

    if (!permission.granted) {
      const result = await requestPermission();

      if (result.granted) {
        router.push(`/qr-scanner?locationId=${id}`);
      } else {
        Alert.alert(
          t("locations.permissionDenied"),
          t("locations.cameraPermissionDenied")
        );
      }
    } else {
      router.push(`/qr-scanner?locationId=${id}`);
    }
  };

  const {
    selectedLocation: location,
    isLoadingDetail,
    errorDetail,
    fetchLocationById,
  } = useLocationsStore();

  const {
    isInCooldown,
    initializeStore,
    sendWaiterRequest,
    sendBillRequest,
    sendAmenityRequest,
    clearAllTimers,
  } = useServiceRequestStore();

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
      <ScrollView showsVerticalScrollIndicator={false}>
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
            >
              <BlurView
                intensity={9.4}
                tint="light"
                className="rounded-[30px] bg-[rgba(255,255,255,0.01)]"
                style={{
                  padding: 8,
                  overflow: "hidden",
                }}
              >
                <ArrowLeft size={20} color="#FFFFFF" />
              </BlurView>
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
              onPress={() => {
                // Navigate to location details or perform action
                router.push(`/location/details/${id}`);
              }}
            >
              <BlurView
                intensity={18}
                tint="light"
                className="flex flex-row items-center justify-center gap-2 overflow-hidden rounded-[54px] border border-[rgba(255,255,255,0.22)] bg-[rgba(255,255,255,0.2)] px-4 py-2"
              >
                <Text className="font-['poppins-medium'] text-base text-white">
                  {t("locations.details")}
                </Text>
                <ArrowRight size={20} color="#FFFFFF" />
              </BlurView>
            </TouchableOpacity>
          </View>
        </View>

        {/* Text Section */}
        <View className="px-5 py-4">
          <Text className="mb-2 font-['poppins-medium'] text-lg leading-6 text-[#492800]">
            {t("locations.whatCanWeDo")}
          </Text>
          <Text className="font-['poppins-light'] text-sm leading-5 text-[#492800]">
            {t("locations.enterTableNumber")}
          </Text>
        </View>

        {/* Action Section */}
        <View className="flex flex-row items-center justify-between px-5 pb-6">
          {/* Left Section - Table Info */}
          <View className="flex flex-row items-center gap-3">
            <Text className="font-['poppins-medium'] text-lg text-[#99621E]">
              {t("locations.yourTable")} {tableNumber ?? ""}
            </Text>
            {!tableNumber && (
              <Button
                text={<QrCode size={18} color="#492800" />}
                className="flex h-10 w-12 flex-row items-center justify-center rounded-lg border border-[#D38B5D36] bg-white p-2"
                onPress={handleQRScanPress}
              />
            )}
          </View>

          {/* Right Section - Reservation Button */}
          <TouchableOpacity
            className="ml-2 flex flex-row items-center justify-center rounded-[54px] bg-[#D38B5D] px-6 py-2"
            onPress={() => {
              // Check if user is authenticated
              if (!isAuthenticated) {
                // Set redirect path and go to login
                setRedirectAfterLogin("/action/location");
                router.push("/login");
                return;
              }

              // Pre-select the location in the store
              const { setSelectedLocationId } = useLocationsStore.getState();
              setSelectedLocationId(location.id);

              // Navigate to reservation flow
              router.push("/action/location");
            }}
          >
            <Text className="font-['poppins-medium'] text-sm text-white">
              {t("locations.makeReservation")}
            </Text>
          </TouchableOpacity>
        </View>

        <View className="mx-5 mb-7">
          <Text className="mb-2 font-['poppins-medium'] text-[#492800]">
            {t("locations.essentialServices")}
          </Text>
          <View className="flex flex-row gap-2">
            {/* Menu Card */}
            <ServiceCard
              title={t("locations.menu")}
              icon={<MenuIcon />}
              onPress={() => {
                if (!isAuthenticated) {
                  setRedirectAfterLogin(`/location/${id}`);
                  router.push("/login");
                  return;
                }
                // TODO: Add menu functionality
                // link to meniuUrl
                Linking.openURL(location.meniuUrl);
              }}
            />

            {/* Waiter Card */}
            <ServiceCard
              title={t("locations.waiter")}
              icon={<WaiterIcon />}
              disabled={
                !tableNumber ||
                (location ? isInCooldown(location.id, "waiter") : false)
              }
              onPress={() => {
                if (!tableNumber) return;
                if (!isAuthenticated) {
                  setRedirectAfterLogin(`/location/${id}`);
                  router.push("/login");
                  return;
                }
                setIsWaiterModalVisible(true);
              }}
            />

            {/* Bill Card */}
            <ServiceCard
              title={t("locations.bill")}
              icon={<BillIcon />}
              disabled={
                !tableNumber ||
                (location ? isInCooldown(location.id, "bill") : false)
              }
              onPress={() => {
                if (!tableNumber) return;
                if (!isAuthenticated) {
                  setRedirectAfterLogin(`/location/${id}`);
                  router.push("/login");
                  return;
                }
                setIsBillModalVisible(true);
              }}
            />
          </View>

          {location?.LocationAmenity.length > 0 && (
            <View className="mt-5 gap-3">
              <Text className="font-['poppins-medium'] text-[#492800]">
                {t("locations.detailsThatMatter")}
              </Text>

              {location.LocationAmenity.map(
                (amenity) =>
                  amenity.amenity.isActive && (
                    <AmenityCard
                      key={amenity.id}
                      title={amenity.amenity.name}
                      description={amenity.amenity.description}
                      icon={amenity.amenity.iconUrl}
                      disabled={
                        !tableNumber ||
                        (location
                          ? isInCooldown(
                              location.id,
                              "amenity",
                              amenity.amenity.id
                            )
                          : false)
                      }
                      onPress={() => {
                        if (!tableNumber) return;
                        if (!isAuthenticated) {
                          setRedirectAfterLogin(`/location/${id}`);
                          router.push("/login");
                          return;
                        }
                        setAmenityModalVisible(amenity.amenity.id, true);
                      }}
                    />
                  )
              )}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Waiter Modal */}
      <AmenityModal
        visible={isWaiterModalVisible}
        loading={location ? isInCooldown(location.id, "waiter") : false}
        onClose={() => setIsWaiterModalVisible(false)}
        text={t("locations.callWaiterQuestion")}
        onConfirm={async () => {
          if (!location) return;

          try {
            const result = await sendWaiterRequest({
              locationId: location.id,
              locationName: location.name,
            });

            if (result.success) {
              Alert.alert(
                t("reservations.success"),
                result.message || t("locations.requestSentSuccess")
              );
            } else {
              Alert.alert(
                t("reservations.error"),
                result.error || t("locations.errorOccurred")
              );
            }
          } catch (error) {
            console.error("Error sending waiter request:", error);
            Alert.alert(
              t("reservations.error"),
              t("locations.unexpectedError")
            );
          } finally {
            setIsWaiterModalVisible(false);
          }
        }}
      />

      {/* Bill Modal */}
      <AmenityModal
        visible={isBillModalVisible}
        loading={location ? isInCooldown(location.id, "bill") : false}
        onClose={() => setIsBillModalVisible(false)}
        text={t("locations.viewBillQuestion")}
        onConfirm={async () => {
          if (!location) return;

          try {
            const result = await sendBillRequest({
              locationId: location.id,
              locationName: location.name,
            });

            if (result.success) {
              Alert.alert(
                t("reservations.success"),
                result.message || t("locations.requestSentSuccess")
              );
            } else {
              Alert.alert(
                t("reservations.error"),
                result.error || t("locations.errorOccurred")
              );
            }
          } catch (error) {
            console.error("Error sending bill request:", error);
            Alert.alert(
              t("reservations.error"),
              t("locations.unexpectedError")
            );
          } finally {
            setIsBillModalVisible(false);
          }
        }}
      />

      {/* Dynamic Amenity Modals */}
      {location?.LocationAmenity.map(
        (amenity) =>
          amenity.amenity.isActive && (
            <AmenityModal
              key={`modal-${amenity.amenity.id}`}
              visible={isAmenityModalVisible(amenity.amenity.id)}
              loading={
                location
                  ? isInCooldown(location.id, "amenity", amenity.amenity.id)
                  : false
              }
              onClose={() => setAmenityModalVisible(amenity.amenity.id, false)}
              text={t("locations.requestAmenityQuestion", {
                amenityName: amenity.amenity.name,
              })}
              onConfirm={async () => {
                if (!location) return;

                try {
                  const result = await sendAmenityRequest({
                    locationId: location.id,
                    locationName: location.name,
                    amenityId: amenity.amenity.id,
                    amenityName: amenity.amenity.name,
                    amenityDescription: amenity.amenity.description,
                  });

                  if (result.success) {
                    Alert.alert(
                      t("reservations.success"),
                      result.message || t("locations.requestSentSuccess")
                    );
                  } else {
                    Alert.alert(
                      t("reservations.error"),
                      result.error || t("locations.errorOccurred")
                    );
                  }
                } catch (error) {
                  console.error("Error sending amenity request:", error);
                  Alert.alert(
                    t("reservations.error"),
                    t("locations.unexpectedError")
                  );
                } finally {
                  setAmenityModalVisible(amenity.amenity.id, false);
                }
              }}
            />
          )
      )}
    </SafeAreaView>
  );
};

export default Location;
