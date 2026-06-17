import { router, useLocalSearchParams } from "expo-router";
import { View, Text, TouchableOpacity } from "react-native";
import { useLanguage } from "@/hooks/useLanguage";

export default function PhoneSent() {
  const { t } = useLanguage();
  const { phone } = useLocalSearchParams<{ phone?: string }>();

  return (
    <View>
      <Text className="font-['Poppins-medium'] font-medium text-black text-center mb-2">
        {t('auth.resetLinkSent')}{" "}
        {phone
          ? ` ${String(phone).slice(0, 3)}${"•".repeat(
              Math.max(0, String(phone).length - 6)
            )}${String(phone).slice(-3)}`
          : ""}
      </Text>

      {/* Subtitle */}
      <Text className="font-['DM Sans'] text-sm font-light text-black text-center mb-10 px-4">
        {t('auth.resetLinkSubtitle')}
      </Text>
      <TouchableOpacity onPress={() => router.push("/login")}>
        <Text className="font-['Poppins-medium'] font-medium text-black text-center mb-2">
          {t('auth.backToLogin')}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
