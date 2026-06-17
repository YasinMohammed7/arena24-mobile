import { View, Text, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";
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
    formState: { errors, isValid },
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
      <Text className="font-['Poppins-medium'] font-medium text-black text-center mb-2 text-lg">
        {t("auth.resetPasswordTitle")}
      </Text>

      {/* Subtitle */}
      <Text className="font-['DM Sans'] text-sm font-light text-black text-center mb-6 px-4">
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
        className="rounded-[40px] py-3 items-center mb-6 flex-row justify-center bg-[#D38B5D]"
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
