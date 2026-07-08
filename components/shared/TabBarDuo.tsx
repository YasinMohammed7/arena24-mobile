import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Href, useRouter } from "expo-router";
import { TabBarDuoProps } from "@/types/sharedComponents";
import { useAuthStore } from "@/zustand/authStore";

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    marginBottom: 20,
  },
  tabBar: {
    flexDirection: "row" as const,
    backgroundColor: "#F5E6D7",
    borderRadius: 37,
    padding: 4,
    minHeight: 40,
  },
  tab: {
    flex: 1,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    borderRadius: 37,
    paddingVertical: 8,
  },
  tabActive: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "rgba(237,197,172,0.21)",
  },
  tabInactive: {
    backgroundColor: "transparent",
  },
  tabText: {
    fontFamily: "Poppins",
    fontSize: 14,
    textAlign: "center" as const,
  },
  tabTextActive: {
    fontWeight: "500",
  },
  tabTextInactive: {
    color: "rgba(73,40,0,0.7)",
    fontWeight: "300",
  },
  title: {
    fontFamily: "Poppins-medium",
    fontWeight: "500",
    color: "#000000",
    textAlign: "center" as const,
  },
});

const TabBarDuo = ({
  principalRoute,
  secondaryRoute,
  principalText,
  secondaryText,
  principalTitle,
  secondaryTitle,
  textColor,
  routePrefix,
  activeTab,
  principalRequiresAuth = false,
  secondaryRequiresAuth = false,
}: TabBarDuoProps) => {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const setRedirectAfterLogin = useAuthStore(
    (state) => state.setRedirectAfterLogin
  );

  const handleTabPress = (tab: string, requiresAuth: boolean) => {
    // Check if authentication is required for this tab
    if (requiresAuth && !isAuthenticated) {
      // Set the redirect path to come back to this tab after login
      setRedirectAfterLogin(`${routePrefix}/${tab}`);
      // Redirect to login
      router.push("/login");
      return;
    }

    // Navigate to the tab
    router.replace(`${routePrefix}/${tab}` as Href);
  };

  const isPrincipalActive = activeTab === principalRoute;
  const isSecondaryActive = activeTab === secondaryRoute;

  return (
    <>
      {/* Title - Only show if both title props are provided */}
      {principalTitle && secondaryTitle && (
        <Text style={styles.title}>
          {isPrincipalActive ? principalTitle : secondaryTitle}
        </Text>
      )}

      {/* Custom Tab Bar */}
      <View style={styles.container}>
        <View style={styles.tabBar}>
          <TouchableOpacity
            activeOpacity={1}
            style={[
              styles.tab,
              isPrincipalActive ? styles.tabActive : styles.tabInactive,
            ]}
            onPress={() =>
              handleTabPress(principalRoute, principalRequiresAuth)
            }
          >
            <Text
              style={[
                styles.tabText,
                isPrincipalActive
                  ? { ...styles.tabTextActive, color: textColor }
                  : styles.tabTextInactive,
              ]}
            >
              {principalText}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={1}
            style={[
              styles.tab,
              isSecondaryActive ? styles.tabActive : styles.tabInactive,
            ]}
            onPress={() =>
              handleTabPress(secondaryRoute, secondaryRequiresAuth)
            }
          >
            <Text
              style={[
                styles.tabText,
                isSecondaryActive
                  ? { ...styles.tabTextActive, color: textColor }
                  : styles.tabTextInactive,
              ]}
            >
              {secondaryText}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

export default TabBarDuo;
