import { useEffect } from "react";
import { useRouter } from "expo-router";

export default function LocationsIndex() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to locationsList by default when entering locations
    router.replace("/(navigationBar)/(locations)/locationsList");
  }, [router]);

  return null; // This component doesn't render anything
}
