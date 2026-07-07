import { Tabs } from "expo-router";
import { Colors } from "@/constants/Colors";
// import { useColorScheme } from "@/hooks/useColorScheme"; pentru dark mode
import HomeIcon from "@/assets/navigationIcons/lifestyle.svg";
import HomeOutline from "@/assets/navigationIcons/lifestyle-outline.svg";
import LocationOutline from "@/assets/navigationIcons/location-outline.svg";
import LocationIcon from "@/assets/navigationIcons/location.svg";
import OffersIcon from "@/assets/navigationIcons/offers.svg";
import OffersOutline from "@/assets/navigationIcons/offers-outline.svg";
import ReservationIcon from "@/assets/navigationIcons/reservation.svg";
import ReservationOutline from "@/assets/navigationIcons/reservation-outline.svg";
import { TabBarNav } from "@/components/TabBarNav";
import ProfileIcon from "@/assets/navigationIcons/profile.svg";
import ProfileOutline from "@/assets/navigationIcons/profile-outline.svg";
import { useLanguage } from "@/hooks/useLanguage";

export default function TabLayout() {
  const { t } = useLanguage();

  return (
    <Tabs
      tabBar={(props) => <TabBarNav {...props} />}
      screenOptions={{
        tabBarInactiveTintColor: Colors["light"].text,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t("navigation.lifestyle"),
          tabBarIcon: ({ color, size, focused }) =>
            focused ? <HomeIcon /> : <HomeOutline />,
        }}
      />
      <Tabs.Screen
        name="(locations)"
        options={{
          title: t("navigation.locations"),
          tabBarIcon: ({ color, size, focused }) =>
            focused ? <LocationIcon /> : <LocationOutline />,
        }}
      />
      <Tabs.Screen
        name="offers"
        options={{
          title: t("navigation.offers"),
          tabBarIcon: ({ color, size, focused }) =>
            focused ? <OffersIcon /> : <OffersOutline />,
        }}
      />
      <Tabs.Screen
        name="(reservations)"
        options={{
          title: t("navigation.reservations"),
          tabBarIcon: ({ color, size, focused }) =>
            focused ? <ReservationIcon /> : <ReservationOutline />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t("navigation.profile"),
          tabBarIcon: ({ color, size, focused }) =>
            focused ? <ProfileIcon /> : <ProfileOutline />,
        }}
      />
    </Tabs>
  );
}
