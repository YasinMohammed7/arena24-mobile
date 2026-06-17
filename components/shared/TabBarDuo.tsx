import { View, TouchableOpacity, Text } from "react-native";
import { Href, useRouter } from "expo-router";
import { TabBarDuoProps } from "@/types/sharedComponents";
import { useAuthStore } from "@/zustand/authStore";

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

  return (
    <>
      {/* Title - Only show if both title props are provided */}
      {principalTitle && secondaryTitle && (
        <Text className="font-['Poppins-medium'] font-medium text-black text-center">
          {activeTab === principalRoute ? principalTitle : secondaryTitle}
        </Text>
      )}

      {/* Custom Tab Bar */}
      <View className="my-5">
        <View className={`flex-row bg-[#F5E6D7] rounded-[37px] p-1 min-h-10`}>
          <TouchableOpacity
            className={`flex-1 items-center justify-center rounded-[37px] py-2 ${
              activeTab === principalRoute
                ? "bg-white border border-[rgba(237,197,172,0.21)]"
                : "bg-transparent"
            }`}
            onPress={() =>
              handleTabPress(principalRoute, principalRequiresAuth)
            }
          >
            <Text
              className={`font-['Poppins'] text-sm text-center ${
                activeTab === principalRoute
                  ? `text-[${textColor}] font-medium`
                  : "text-[rgba(73,40,0,0.7)] font-light"
              }`}
            >
              {principalText}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`flex-1 items-center justify-center rounded-[37px] py-2 ${
              activeTab === secondaryRoute
                ? "bg-white border border-[rgba(237,197,172,0.21)]"
                : "bg-transparent"
            }`}
            onPress={() =>
              handleTabPress(secondaryRoute, secondaryRequiresAuth)
            }
          >
            <Text
              className={`font-['Poppins'] text-sm text-center ${
                activeTab === secondaryRoute
                  ? "text-[#99621E] font-medium"
                  : "text-[rgba(73,40,0,0.7)] font-light"
              }`}
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
