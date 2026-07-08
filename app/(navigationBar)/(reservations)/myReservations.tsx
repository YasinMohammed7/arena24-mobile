import {
  ScrollView,
  View,
  Text,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import React, { useState, useMemo, useEffect } from "react";
import BurgerIcon from "@/assets/reservations-icons/burger-icon.svg";
import ReservationDropdown from "@/components/reservations/ReservationDropdown";
import ReservationCardItem from "@/components/reservations/ReservationCardItem";
import { useReservationsStore } from "@/zustand/reservationsStore";
import { useAuthStore } from "@/zustand/authStore";
import { ServerReservation } from "@/types/serverReservation";
import { useLanguage } from "@/hooks/useLanguage";

export default function MyReservationsScreen() {
  // const [isActiveReservationsExpanded, setIsActiveReservationsExpanded] =
  // useState(false);
  const [isEventReservationsExpanded, setIsEventReservationsExpanded] =
    useState(true);
  const [isPastReservationsExpanded, setIsPastReservationsExpanded] =
    useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { t, getLocale } = useLanguage();
  const locale = getLocale();

  // Store hooks
  const {
    reservations,
    getAllReservationsByUser,
    isLoadingReservations,
    reservationsError,
  } = useReservationsStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (user?.id) {
      getAllReservationsByUser(user.id);
    }
  }, [user?.id, getAllReservationsByUser]);

  // const handleActiveReservationsPress = () => {
  //   setIsActiveReservationsExpanded(!isActiveReservationsExpanded);
  // };

  const handleEventReservationsPress = () => {
    setIsEventReservationsExpanded(!isEventReservationsExpanded);
  };

  const handlePastReservationsPress = () => {
    setIsPastReservationsExpanded(!isPastReservationsExpanded);
  };

  const onRefresh = async () => {
    if (user?.id) {
      setRefreshing(true);
      try {
        await getAllReservationsByUser(user.id);
      } finally {
        setRefreshing(false);
      }
    }
  };

  // Map server reservations to component format
  const mappedReservations = useMemo(() => {
    if (!reservations || !Array.isArray(reservations)) return [];

    return reservations.map((reservation: ServerReservation) => {
      // Determine reservation type and details
      const isEventReservation =
        reservation.event !== null && reservation.eventId !== null;

      let locationName = t("locations.unknownLocation");
      let title = t("reservations.tableReservation");
      let displayDate = "";
      let displayTime = "TBD";

      if (isEventReservation && reservation.event) {
        // Event reservation — use reservation.location directly
        locationName =
          reservation.location?.name || t("locations.unknownLocation");
        title = reservation.event.name;
        displayDate = new Date(reservation.event.date).toLocaleDateString(
          locale,
          {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          }
        );
        displayTime = new Date(reservation.event.startHour).toLocaleTimeString(
          locale,
          {
            hour: "2-digit",
            minute: "2-digit",
          }
        );
      } else {
        // Restaurant reservation
        locationName =
          reservation.location?.name || t("locations.unknownLocation");
        displayDate = new Date(reservation.createdAt).toLocaleDateString(
          locale,
          {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          }
        );
      }

      const reservationType: "event" | "location" | "rental" =
        isEventReservation ? "event" : "location";

      // Check if event is in the past and should be marked as finished
      let finalStatus = reservation.status;
      if (isEventReservation && reservation.event) {
        const eventDateTime = new Date(reservation.event.date);
        const eventTime = new Date(reservation.event.startHour);

        // Combine date and time
        eventDateTime.setHours(eventTime.getHours());
        eventDateTime.setMinutes(eventTime.getMinutes());
        eventDateTime.setSeconds(eventTime.getSeconds());

        // If event is in the past, mark as finished
        if (eventDateTime < new Date() && finalStatus !== "CANCELLED") {
          finalStatus = "FINISHED";
        }
      }

      return {
        id: reservation.id,
        location: locationName,
        type: reservationType,
        title: title,
        status: finalStatus,
        date: displayDate,
        time: displayTime,
        people: reservation.peopleCount || 1,
        note: reservation.details || undefined,
      };
    });
  }, [reservations, locale, t]);

  // Filter reservations for active ones (restaurant with pending/confirmed status)
  // const activeReservations = useMemo(() => {
  //   return mappedReservations.filter(
  //     (reservation) =>
  //       reservation.type === "location" &&
  //       (reservation.status === "PENDING" || reservation.status === "CONFIRMED")
  //   );
  // }, [mappedReservations]);

  // Filter reservations for events (active events only - not finished or cancelled)
  const eventReservations = useMemo(() => {
    return mappedReservations.filter(
      (reservation) =>
        reservation.type === "event" &&
        reservation.status !== "FINISHED" &&
        reservation.status !== "CANCELLED"
    );
  }, [mappedReservations]);

  // Filter reservations for past/cancelled ones (finished or cancelled status)
  const pastReservations = useMemo(() => {
    return mappedReservations.filter(
      (reservation) =>
        reservation.status === "FINISHED" || reservation.status === "CANCELLED"
    );
  }, [mappedReservations]);

  // Loading state
  if (isLoadingReservations) {
    return (
      <View className="flex-1 items-center justify-center py-10">
        <ActivityIndicator size="large" color="#D38B5D" />
        <Text className="mt-4 font-['poppins-medium'] text-lg text-[#492800]">
          {t("reservations.loadingReservations")}
        </Text>
      </View>
    );
  }

  // Error state
  if (reservationsError) {
    return (
      <View className="flex-1 items-center justify-center px-5 py-10">
        <Text className="mb-4 text-center font-['poppins-medium'] text-lg text-[#492800]">
          {reservationsError}
        </Text>
      </View>
    );
  }

  return (
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
      <View className="gap-4">
        <Text className="text-center font-['hotel-resort'] text-lg text-[#492800]">
          {t("reservations.myReservations")}
        </Text>

        {/* Active Reservations Dropdown */}
        {/* Active Reservations Dropdown
        <ReservationDropdown
          icon={BurgerIcon}
          text={t("reservations.activeReservations")}
          onPress={handleActiveReservationsPress}
          isExpanded={isActiveReservationsExpanded}
        >
          <View className="gap-4">
            {activeReservations.length > 0 ? (
              activeReservations.map((reservation) => (
                <ReservationCardItem key={reservation.id} {...reservation} />
              ))
            ) : (
              <Text className="py-4 text-center font-['poppins-light'] text-[#492800B2]">
                {t("reservations.noActiveReservations")}
              </Text>
            )}
          </View>
        </ReservationDropdown>
        */}

        {/* Event Reservations Dropdown */}
        <ReservationDropdown
          icon={BurgerIcon}
          text={t("reservations.eventsRegistered")}
          onPress={handleEventReservationsPress}
          isExpanded={isEventReservationsExpanded}
        >
          <View className="gap-4">
            {eventReservations.length > 0 ? (
              eventReservations.map((reservation) => (
                <ReservationCardItem key={reservation.id} {...reservation} />
              ))
            ) : (
              <Text className="py-4 text-center font-['poppins-light'] text-[#492800B2]">
                {t("reservations.noEventsRegistered")}
              </Text>
            )}
          </View>
        </ReservationDropdown>

        {/* Past/Cancelled Reservations Dropdown */}
        <ReservationDropdown
          icon={BurgerIcon}
          text={t("reservations.history")}
          onPress={handlePastReservationsPress}
          isExpanded={isPastReservationsExpanded}
        >
          <View className="gap-4">
            {pastReservations.length > 0 ? (
              pastReservations.map((reservation) => (
                <ReservationCardItem key={reservation.id} {...reservation} />
              ))
            ) : (
              <Text className="py-4 text-center font-['poppins-light'] text-[#492800B2]">
                {t("reservations.noHistory")}
              </Text>
            )}
          </View>
        </ReservationDropdown>
      </View>
    </ScrollView>
  );
}
