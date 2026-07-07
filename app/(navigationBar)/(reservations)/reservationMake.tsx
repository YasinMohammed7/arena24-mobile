import { FlatList } from "react-native";
import { useMemo } from "react";
import ReservationCard from "@/components/reservations/ReservationOptionsCard";
import { getReservations } from "@/data/dummy";
import type { ReservationItem } from "@/types/reservations";
import { useRouter } from "expo-router";
import { useAuthStore } from "@/zustand/authStore";

export default function ReservationMakeScreen() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const setRedirectAfterLogin = useAuthStore(
    (state) => state.setRedirectAfterLogin
  );

  // Get reservations with translations based on current language
  const reservations = useMemo(() => getReservations(), []);

  const handleReservationPress = (type: string) => {
    // Check if both type and user is not authenticated
    if (!isAuthenticated) {
      // Set redirect path and go to login
      setRedirectAfterLogin(`/action/${type}`);
      router.push("/login");
      return;
    }

    router.push(`/action/${type}`);
    // Handle different reservation actions based on id
  };

  const renderReservationCard = ({ item }: { item: ReservationItem }) => (
    <ReservationCard
      icon={item.icon}
      title={item.title}
      description={item.description}
      onPress={() => handleReservationPress(item.type)}
    />
  );

  return (
    <FlatList
      data={reservations}
      renderItem={renderReservationCard}
      keyExtractor={(item) => item.id.toString()}
      showsVerticalScrollIndicator={false}
    />
  );
}
