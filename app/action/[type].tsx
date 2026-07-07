import { View, Text, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, router } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { telegramService } from "@/services/telegramService";
import { useState } from "react";
// import ProgressStepsBar from "@/components/shared/ProgressStepsBar";
import { ProgressStep, ProgressSteps } from "react-native-progress-steps";
import LocationsStep from "@/components/reservations/LocationsStep";
import EventsStep from "@/components/reservations/EventsStep";
import DatePickerStep from "@/components/reservations/DatePickerStep";
import DetailsStep from "@/components/reservations/DetailsStep";
import { useLocationsStore } from "@/zustand/locationsStore";
import { useEventReservationStore } from "@/zustand/eventReservationStore";
import { useDateReservationStore } from "@/zustand/dateReservationStore";
import { useDetailsReservationStore } from "@/zustand/detailsReservationStore";
import { useLanguage } from "@/hooks/useLanguage";

export default function ActionScreen() {
  const { type } = useLocalSearchParams<{ type: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t, getLocale } = useLanguage();
  const locale = getLocale();

  const selectedLocationId = useLocationsStore(
    (state) => state.selectedLocationId
  );
  const clearSelectedLocation = useLocationsStore(
    (state) => state.clearSelectedLocation
  );
  const isEventFormValid = useEventReservationStore((state) =>
    state.isFormValid()
  );
  const isDateFormValidForEvent = useDateReservationStore((state) =>
    state.isFormValidForEvent()
  );
  const isDateFormValidForLocation = useDateReservationStore((state) =>
    state.isFormValidForLocation()
  );

  const location = useLocationsStore((state) => state.locations).find(
    (location) => location.id === selectedLocationId
  );

  const guestInput = useDateReservationStore((state) => state.guestInput);
  const selectedDate = useDateReservationStore((state) => state.selectedDate);
  const selectedNumber = useDateReservationStore(
    (state) => state.selectedNumber
  );
  const selectedTimeSlotId = useDateReservationStore(
    (state) => state.selectedTimeSlotId
  );
  const isAllDay = useDateReservationStore((state) => state.isAllDay);

  const details = useDetailsReservationStore((state) => state.details);
  const selectedEventType = useEventReservationStore(
    (state) => state.selectedEventType
  );
  const selectedBudget = useEventReservationStore(
    (state) => state.selectedBudget
  );
  const needsStaff = useEventReservationStore((state) => state.needsStaff);
  const needsDJ = useEventReservationStore((state) => state.needsDJ);
  const needsValetParking = useEventReservationStore(
    (state) => state.needsValetParking
  );
  const needsSecurity = useEventReservationStore(
    (state) => state.needsSecurity
  );
  const needsHostess = useEventReservationStore((state) => state.needsHostess);

  // Reset methods
  const resetEventForm = useEventReservationStore((state) => state.resetForm);
  const resetDateForm = useDateReservationStore((state) => state.resetForm);
  const resetDetails = useDetailsReservationStore((state) => state.reset);

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      let message = "";

      if (type === "event") {
        // log all keys for event reservation store
        // console.log("Event reservation store:", {
        //   guestInput,
        //   selectedDate,
        //   selectedTimeSlotId,
        //   needsStaff,
        //   needsDJ,
        //   needsValetParking,
        //   needsSecurity,
        //   needsHostess,
        //   selectedEventType,
        //   selectedBudget,
        //   details,
        // });

        // Format event reservation message
        const services = [];
        if (needsStaff) services.push(t("reservations.staff"));
        if (needsDJ) services.push(t("reservations.dj"));
        if (needsValetParking) services.push(t("reservations.valetParking"));
        if (needsSecurity) services.push(t("reservations.security"));
        if (needsHostess) services.push(t("reservations.hostess"));

        message = `
🎉 <b>${t("reservations.myEvent").toUpperCase()}</b>

🏪 <b>${t("reservations.location")}:</b> ${
          location?.name || t("reservations.unknown")
        }
👥 <b>${t("reservations.guests")}:</b> ${guestInput}
📅 <b>${t("reservations.selectDate")}:</b> ${
          selectedDate
            ? new Date(selectedDate).toLocaleDateString(locale, {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })
            : t("reservations.unspecified")
        }
⏰ <b>${t("reservations.schedule")}:</b> ${
          isAllDay ? t("reservations.allDay") : t("reservations.partial")
        }
🎊 <b>${t("reservations.eventType")}:</b> ${
          selectedEventType || t("reservations.unspecified")
        }
💰 <b>${t("reservations.budget")}:</b> ${
          selectedBudget || t("reservations.unspecified")
        }
${
  services.length > 0
    ? `🛎️ <b>${t("reservations.additionalServices")}:</b> ${services.join(
        ", "
      )}`
    : ""
}
${
  details?.name
    ? `👤 <b>${t("reservations.contactName")}:</b> ${details.name}`
    : ""
}
${
  details?.phone ? `📞 <b>${t("reservations.phone")}:</b> ${details.phone}` : ""
}
${
  details?.specialRequirements
    ? `📝 <b>${t("reservations.specialRequests")}:</b> ${
        details.specialRequirements
      }`
    : ""
}

⏰ <b>${t("reservations.requestSentAt")}:</b> ${new Date().toLocaleString(
          "ro-RO"
        )}
        `.trim();
      } else {
        // log all keys for location reservation store
        // console.log("Location reservation store:", {
        //   selectedNumber,
        //   selectedTimeSlotId,
        //   details,
        //   selectedDate,
        //   selectedLocationId,
        // });

        // Format location reservation message
        message = `
🍽️ <b>${t("reservations.tableReservation").toUpperCase()}</b>

🏪 <b>${t("reservations.location")}:</b> ${
          location?.name || t("reservations.unknown")
        }
👥 <b>${t("reservations.numberOfPeople")}:</b> ${selectedNumber}
📅 <b>${t("reservations.selectDate")}:</b> ${
          selectedDate
            ? new Date(selectedDate).toLocaleDateString(locale, {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })
            : t("reservations.unspecified")
        }
⏰ <b>${t("reservations.timeSlot")}:</b> ${
          selectedTimeSlotId || t("reservations.unspecified")
        }
${
  details?.name
    ? `👤 <b>${t("reservations.contactName")}:</b> ${details.name}`
    : ""
}
${
  details?.phone ? `📞 <b>${t("reservations.phone")}:</b> ${details.phone}` : ""
}
${
  details?.specialRequirements
    ? `📝 <b>${t("reservations.specialRequests")}:</b> ${
        details.specialRequirements
      }`
    : ""
}

⏰ <b>${t("reservations.requestSentAt")}:</b> ${new Date().toLocaleString(
          "ro-RO"
        )}
        `.trim();
      }

      // Find specific group for the location/restaurant
      const restaurantName = location?.name || "Arena 24";
      const groupChatId = await telegramService.findGroupByName(restaurantName);
      const targetChatId =
        groupChatId || process.env.EXPO_PUBLIC_TELEGRAM_CHAT_ID || "";

      // Send telegram message to specific group or fallback to default
      const response = await telegramService.sendMessage({
        chat_id: targetChatId,
        text: message,
        parse_mode: "HTML",
      });

      if (response.ok) {
        // Reset all form values after successful submission
        resetEventForm();
        resetDateForm();
        resetDetails();
        clearSelectedLocation();

        Alert.alert(
          t("reservations.success"),
          t("reservations.successMessage"),
          [
            {
              text: t("common.ok"),
              onPress: () => router.back() ?? router.replace("/"),
            },
          ]
        );
      } else {
        throw new Error(response.description || t("reservations.errorMessage"));
      }
    } catch (error: any) {
      console.error("Error submitting reservation:", error);
      Alert.alert(t("reservations.error"), t("reservations.errorMessage"), [
        { text: t("common.ok") },
      ]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    router.back() ?? router.replace("/");
  };

  const progressStepsConfig = {
    topOffset: 20,
    activeStepIconBorderColor: "#D38B5D",
    completedProgressBarColor: "#D38B5D",
    activeLabelColor: "#492800",
    completedLabelColor: "#99621E",
    disabledStepIconColor: "#F9EDE6",
    labelColor: "rgba(73, 40, 0, 0.3)",
    activeStepIconColor: "#D38B5D",
    completedStepIconColor: "#D38B5D",
    progressBarColor: "#F9EDE6",
    borderWidth: 2,
    activeStepNumColor: "#FFFFFF",
    completedStepNumColor: "#FFFFFF",
    disabledStepNumColor: "rgba(73, 40, 0, 0.5)",
  };

  const buttonConfig = {
    buttonFillColor: "#D38B5D",
    buttonBorderColor: "#D38B5D",
    buttonNextTextColor: "#FFFFFF",
    buttonPreviousTextColor: "#D38B5D",
    buttonFinishTextColor: "#FFFFFF",
    buttonTopOffset: 20,
    buttonBottomOffset: 20,
    buttonHorizontalOffset: 20,
  };

  return (
    <SafeAreaView className="mt-4 flex-1 bg-white px-3">
      <View className="relative flex flex-row items-center justify-center">
        {/* Back Button - positioned to the left */}
        <TouchableOpacity
          onPress={handleBack}
          className="absolute left-0 rounded-[30px] bg-[#492800]/5 p-2"
        >
          <ArrowLeft size={20} color="#492800" />
        </TouchableOpacity>

        {/* Title Text - centered */}
        <Text className="font-['poppins-regular'] text-lg font-medium text-[#492800]">
          {type === "location"
            ? t("reservations.bookTable")
            : t("reservations.myEvent")}
        </Text>
      </View>
      {type === "event" ? (
        <ProgressSteps {...progressStepsConfig}>
          <ProgressStep
            {...buttonConfig}
            buttonNextText={t("reservations.continue")}
            buttonNextDisabled={!isEventFormValid}
            label={t("reservations.type")}
          >
            <EventsStep />
          </ProgressStep>

          <ProgressStep
            {...buttonConfig}
            buttonNextText={t("reservations.continue")}
            buttonPreviousText={t("reservations.back")}
            buttonNextDisabled={selectedLocationId === null}
            label={t("reservations.location")}
          >
            <LocationsStep />
          </ProgressStep>

          <ProgressStep
            {...buttonConfig}
            label={t("reservations.dateTime")}
            buttonNextText={t("reservations.continue")}
            buttonPreviousText={t("reservations.back")}
            buttonNextDisabled={!isDateFormValidForEvent}
          >
            <DatePickerStep locationId={selectedLocationId} type="event" />
          </ProgressStep>

          <ProgressStep
            {...buttonConfig}
            label={t("reservations.details")}
            buttonFinishText={
              isSubmitting
                ? t("reservations.sending")
                : t("reservations.reserve")
            }
            buttonPreviousText={t("reservations.back")}
            onSubmit={handleSubmit}
          >
            <DetailsStep />
          </ProgressStep>
        </ProgressSteps>
      ) : (
        <ProgressSteps {...progressStepsConfig}>
          <ProgressStep
            {...buttonConfig}
            buttonNextText={t("reservations.continue")}
            buttonNextDisabled={selectedLocationId === null}
            label={t("reservations.location")}
          >
            <LocationsStep />
          </ProgressStep>

          <ProgressStep
            {...buttonConfig}
            label={t("reservations.dateTime")}
            buttonNextText={t("reservations.continue")}
            buttonPreviousText={t("reservations.back")}
            buttonNextDisabled={!isDateFormValidForLocation}
          >
            <DatePickerStep locationId={selectedLocationId} type="location" />
          </ProgressStep>

          <ProgressStep
            onSubmit={handleSubmit}
            {...buttonConfig}
            label={t("reservations.details")}
            buttonFinishText={
              isSubmitting
                ? t("reservations.sending")
                : t("reservations.reserve")
            }
            buttonPreviousText={t("reservations.back")}
          >
            <DetailsStep />
          </ProgressStep>
        </ProgressSteps>
      )}
    </SafeAreaView>
  );
}
