import { View, Text } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  getResetPasswordSchema,
  type ResetPasswordFormData,
} from "@/schemas/authSchemas";
import { ResetPasswordData } from "@/types/auth";
import PasswordInput from "@/components/auth/PasswordInput";
import Button from "@/components/shared/Button";
import { useLanguage } from "@/hooks/useLanguage";

const ResetPassword = () => {
  const { t } = useLanguage();
  const { token } = useLocalSearchParams<{ token: string }>();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(getResetPasswordSchema()),
    mode: "onChange",
  });

  // Clear errors when component mounts
  //   useEffect(() => {
  //     setError(null);
  //     setSuccess(false);
  //   }, []);

  const handleResetPassword = async (data: ResetPasswordFormData) => {
    const resetData: ResetPasswordData = {
      ...data,
      token: token || "",
    };
    console.log(resetData);
  };

  const handleBack = () => {
    router.push("/(auth)/login");
  };

  return (
    <View className="flex-1 justify-center">
      {/* Title */}
      <Text className="mb-2 text-center font-['Poppins-medium'] text-lg font-medium text-black">
        {t("auth.resetPasswordTitle")}
      </Text>

      {/* Subtitle */}
      <Text className="font-['DM Sans'] mb-6 px-4 text-center text-sm font-light text-black">
        {t("auth.resetPasswordSubtitle")}
      </Text>

      {/* Password Field */}
      <View className="mb-4">
        <PasswordInput
          name="password"
          control={control}
          label={t("auth.newPassword")}
          placeholder={t("auth.enterNewPassword")}
          error={errors.password}
        />
      </View>

      {/* Confirm Password Field */}
      <View className="mb-6">
        <PasswordInput
          name="confirmPassword"
          control={control}
          label={t("auth.confirmNewPassword")}
          placeholder={t("auth.confirmNewPasswordPlaceholder")}
          error={errors.confirmPassword}
        />
      </View>

      {/* Reset Button */}

      <Button
        text={t("auth.resetPasswordButton")}
        onPress={handleSubmit(handleResetPassword)}
        // disabled={!isValid}
        className="mb-6 flex-row items-center justify-center rounded-[40px] bg-[#D38B5D] py-3"
      />

      {/* Back Button */}
      <Button
        text={t("auth.backToLogin")}
        onPress={handleBack}
        textStyle="font-['DM Sans'] font-light text-base text-black"
        className="items-center"
      />
    </View>
  );
};

export default ResetPassword;
