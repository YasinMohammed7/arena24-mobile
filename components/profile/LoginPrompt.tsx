import { View, Text } from "react-native";
import { LoginPromptProps } from "../../types/profile";
import Button from "../shared/Button";
import { useLanguage } from "@/hooks/useLanguage";
import { LanguageSwitcher } from "../shared/LanguageSwitcher";

export default function LoginPrompt({
  onLogin,
  onCreateAccount,
}: LoginPromptProps) {
  const { t } = useLanguage();

  return (
    <View className="justify-between items-center flex-1 py-6">
      <View className="flex-1 justify-center items-center w-full">
        <Text className="text-[#492800] font-['Dm Sans'] font-light text-lg text-center">
          {t("profile.notAuthenticated")}
        </Text>
        <Text className="text-[#492800] font-['Dm Sans'] font-light text-lg leading-6 text-center mt-2">
          {t("profile.loginPromptMessage")}
        </Text>
        <Button
          className="rounded-[40px] py-3 w-full items-center bg-white border border-gray-200 mt-10 justify-center"
          onPress={onLogin}
          text={t("auth.loginButton")}
          textStyle="font-['DM Sans'] text-sm font-medium text-[#3C4043]"
        />
        <Button
          className="bg-[#D38B5D] rounded-[40px] py-3 items-center w-full mt-2"
          onPress={onCreateAccount}
          text={t("auth.createAccount")}
        />
      </View>
    </View>
  );
}
