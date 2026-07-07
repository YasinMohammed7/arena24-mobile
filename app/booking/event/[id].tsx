import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, MapPin } from "lucide-react-native";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useEventsStore } from "@/zustand/eventsStore";
import { useReservationsStore } from "@/zustand/reservationsStore";
import FormInput from "@/components/auth/FormInput";
import { createBookingSchema } from "@/schemas/authSchemas";
import { useLanguage } from "@/hooks/useLanguage";

export default function EventBookingScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { t } = useLanguage();

  const event = useEventsStore((state) => state.eventDetail);
  const errorDetail = useEventsStore((state) => state.errorDetail);

  const {
    createEventReservation,
    isCreatingEventReservation,
    eventReservationError,
    eventReservationSuccess,
    clearErrors,
    clearSuccess,
  } = useReservationsStore();

  const maxLength = event?.maxPeople.toString().length ?? 3;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createBookingSchema(event?.maxPeople ?? 999)),
    defaultValues: {
      numberOfParticipants: "1",
      specialRequirements: "",
    },
  });

  const numberOfParticipants = useWatch({
    name: "numberOfParticipants",
    control,
  });
  const numericParticipants = parseInt(numberOfParticipants || "1", 10);

  const totalPrice = numericParticipants * (event?.price ?? 0);

  const handleReservation = async (data: any) => {
    if (!event || !id) {
      Alert.alert(t("common.error"), t("events.eventInfoUnavailable"));
      return;
    }

    const participants = parseInt(data.numberOfParticipants || "1", 10);

    try {
      // Clear any previous errors
      clearErrors();

      // Create reservation data
      const reservationData = {
        eventId: parseInt(id),
        peopleCount: participants,
        details: data.specialRequirements || undefined,
      };

      // Create the reservation
      await createEventReservation(reservationData);
    } catch (error) {
      // Error is handled in the store
      console.error("Reservation error:", error);
    }
  };

  const handleCancel = () => {
    router.back() ?? router.replace("/");
  };

  // Handle reservation errors
  useEffect(() => {
    if (eventReservationError) {
      Alert.alert(t("events.reservationError"), eventReservationError, [
        {
          text: t("common.ok"),
          onPress: () => clearErrors(),
        },
      ]);
    }
  }, [eventReservationError, t, clearErrors]);

  // Handle reservation success
  useEffect(() => {
    if (eventReservationSuccess) {
      Alert.alert(
        t("events.reservationSent"),
        `${t("events.reservationFor")} ${numericParticipants} ${
          numericParticipants === 1 ? t("events.person") : t("events.people")
        } ${t("events.atEvent")} "${event?.name}" ${t("events.hasBeenSent")}`,
        [
          {
            text: t("common.ok"),
            onPress: () => {
              clearSuccess();
              router.back() ?? router.replace("/");
            },
          },
        ]
      );
    }
  }, [
    eventReservationSuccess,
    event?.name,
    numericParticipants,
    t,
    clearSuccess,
    router,
  ]);

  // Error state
  if (errorDetail || !event) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 items-center justify-center px-5">
          <Text className="mb-4 font-['poppins-medium'] text-lg text-[#492800]">
            {errorDetail || t("events.eventNotFound")}
          </Text>
          <TouchableOpacity
            className="rounded-[54px] bg-[#D38B5D] px-6 py-3"
            onPress={() => router.back() ?? router.replace("/")}
          >
            <Text className="font-['poppins-medium'] text-base text-white">
              {t("common.back")}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#FFFDFB]">
      {/* Scrollable Content */}
      <View className="flex-1 px-5">
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View className="relative mb-4 mt-5 flex flex-row items-center justify-center">
            {/* Back Button - positioned to the left */}
            <TouchableOpacity
              onPress={() => router.back() ?? router.replace("/")}
              className="absolute left-0 z-10 rounded-[30px] bg-[#492800]/5 p-2"
            >
              <ArrowLeft size={20} color="#492800" />
            </TouchableOpacity>

            <Text className="flex-1 text-center font-['hotel-resort'] text-lg text-[#492800]">
              {t("reservations.title").toUpperCase()}
            </Text>
          </View>

          {/* Event Info Section */}
          <View className="flex-row items-stretch gap-2.5">
            <View className="flex-1 flex-col items-center gap-1">
              <Text className="text-center font-['hotel-resort'] text-xl text-[#492800]">
                {event.name}
              </Text>
              <View className="flex-row items-center gap-1">
                <MapPin size={12} color="#492800" strokeWidth={1.5} />
                <Text className="font-['poppins-medium'] text-xs text-[#492800]">
                  {event.location.name}
                </Text>
              </View>
            </View>
          </View>

          {/* Number of Participants */}
          <View className="mt-8">
            <FormInput
              name="numberOfParticipants"
              control={control}
              label={t("events.numberOfParticipants")}
              placeholder={t("events.onePersonPlaceholder")}
              error={errors.numberOfParticipants}
              keyboardType="number-pad"
              selectTextOnFocus
              maxLength={maxLength}
              className={
                Platform.OS === "ios"
                  ? "rounded-[14px] border border-[#E4E4E4] bg-white px-4 py-3 font-['poppins-medium'] text-sm text-[#000]"
                  : undefined
              }
            />
          </View>

          {/* Special Requirements */}
          <View className="mb-8 mt-6">
            <FormInput
              name="specialRequirements"
              control={control}
              label={t("reservations.specialRequests")}
              placeholder={t("events.otherRequirements")}
              error={errors.specialRequirements}
              multiline
              textAlignVertical="top"
              className="h-32 rounded-[14px] border border-[#E4E4E4] bg-white px-4 py-4 font-['poppins-medium'] text-sm text-[#000]"
            />
          </View>
        </ScrollView>
      </View>

      {/* Fixed Bottom Section - Total & Buttons */}
      <View className="bg-[#FFFDFB] px-5 pb-6 pt-4">
        {/* Price Section */}
        <View className="flex-row items-end justify-between">
          <View>
            <Text className="mb-1 font-['poppins-medium'] text-lg text-[#492800]">
              {t("events.total")}
            </Text>
            <Text className="font-['poppins-light'] text-sm text-[#492800]">
              {numericParticipants} x {event?.price || 150} {t("events.lei")}
            </Text>
          </View>
          <Text className="font-['poppins-medium'] text-lg text-[#492800]">
            {totalPrice} {t("events.lei")}
          </Text>
        </View>

        {/* Action Buttons */}
        <View className="mt-6 flex-row gap-3">
          {/* Cancel Button */}
          <TouchableOpacity
            onPress={handleCancel}
            className="flex-1 flex-row items-center justify-center rounded-[54px] border border-[#CFCFCF] bg-white px-10 py-3"
          >
            <Text className="font-['poppins-medium'] text-base text-[#616161]">
              {t("events.cancel")}
            </Text>
          </TouchableOpacity>

          {/* Reserve Button */}
          <TouchableOpacity
            onPress={handleSubmit(handleReservation)}
            disabled={isCreatingEventReservation}
            className={`flex-1 ${
              isCreatingEventReservation ? "bg-[#D38B5D]/50" : "bg-[#D38B5D]"
            } flex-row items-center justify-center rounded-[54px] px-10 py-3`}
          >
            <Text className="font-['poppins-medium'] text-base text-white">
              {isCreatingEventReservation
                ? t("events.processing")
                : t("reservations.reserve")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
