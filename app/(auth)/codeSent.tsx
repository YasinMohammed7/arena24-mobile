import { router, useLocalSearchParams } from "expo-router";
import { View, Text, TouchableOpacity } from "react-native";
import { useLanguage } from "@/hooks/useLanguage";

export default function CodeSent() {
  const { t } = useLanguage();
  const { email } = useLocalSearchParams<{ email?: string }>();

  return (
    <View>
      <Text className="mb-2 text-center font-['Poppins-medium'] font-medium text-black">
        {t("auth.resetLinkSent")} {email || ""}
      </Text>

      {/* Subtitle */}
      <Text className="font-['DM Sans'] mb-10 px-4 text-center text-sm font-light text-black">
        {t("auth.resetLinkSubtitle")}
      </Text>
      <TouchableOpacity onPress={() => router.push("/login")}>
        <Text className="mb-2 text-center font-['Poppins-medium'] font-medium text-black">
          {t("auth.backToLogin")}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
