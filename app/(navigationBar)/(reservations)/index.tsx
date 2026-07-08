import { useEffect } from "react";
import { useRouter } from "expo-router";

export default function ReservationsIndex() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to locationsList by default when entering locations
    router.replace("/(navigationBar)/(reservations)/myReservations");
  }, [router]);

  return null; // This component doesn't render anything
}
