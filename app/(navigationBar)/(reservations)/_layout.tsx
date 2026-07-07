import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Slot, useSegments } from "expo-router";
import TabBarDuo from "@/components/shared/TabBarDuo";
import { useLanguage } from "@/hooks/useLanguage";

const ReservationsLayout = () => {
  const segments = useSegments();
  const currentRoute = segments[segments.length - 1] || "reservationMake";
  const { t } = useLanguage();

  return (
    <SafeAreaView
      className="flex-1 bg-white px-5"
      edges={["top", "left", "right"]}
    >
      <View>
        <TabBarDuo
          principalRoute="reservationMake"
          secondaryRoute="myReservations"
          principalText={t("reservations.makeReservation")}
          secondaryText={t("reservations.myReservationsTab")}
          textColor="#99621E"
          routePrefix="/(navigationBar)/(reservations)"
          activeTab={currentRoute}
          secondaryRequiresAuth={true}
        />
      </View>
      <View className="flex-1">
        <Slot />
      </View>
    </SafeAreaView>
  );
};

export default ReservationsLayout;
