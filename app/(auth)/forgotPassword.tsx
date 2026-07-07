import { View, Text } from "react-native";
import { useEffect } from "react";
import { router } from "expo-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  getForgotPasswordSchema,
  type ForgotPasswordFormData,
} from "@/schemas/authSchemas";
import { useAuthStore } from "@/zustand/authStore";
import FormInput from "@/components/auth/FormInput";
import Button from "@/components/shared/Button";
import { useLanguage } from "@/hooks/useLanguage";

const ForgotPassword = () => {
  const { t } = useLanguage();

  const {
    forgotPassword,
    isLoading,
    forgotPasswordError,
    setForgotPasswordError,
    setForgotPasswordSuccess,
  } = useAuthStore();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(getForgotPasswordSchema()),
    mode: "onChange",
  });

  // Clear errors and success state when component mounts
  useEffect(() => {
    setForgotPasswordError(null);
    setForgotPasswordSuccess(false);
  }, [setForgotPasswordError, setForgotPasswordSuccess]);

  const handleSendPhone = async (data: ForgotPasswordFormData) => {
    const response = await forgotPassword(data.phone);
    if (response) {
      router.push({
        pathname: "/phoneSent",
        params: { phone: data.phone },
      });
    }
  };

  const handleBack = () => {
    router.back() ?? router.replace("/");
  };

  return (
    <View>
      {/* Title */}
      <Text className="mb-2 text-center font-['Poppins-medium'] font-medium text-black">
        {t("auth.forgotPasswordTitle")}
      </Text>

      {/* Subtitle */}
      <Text className="font-['DM Sans'] mb-6 px-4 text-center text-sm font-light text-black">
        {t("auth.forgotPasswordSubtitle")}
      </Text>

      {/* Phone Field */}
      <View className="mb-8">
        <FormInput
          name="phone"
          control={control}
          label={t("auth.phoneNumberRequired")}
          placeholder="0712345678"
          keyboardType="phone-pad"
          autoCapitalize="none"
          error={errors.phone}
        />
      </View>

      {/* Error Message */}
      {forgotPasswordError && (
        <View className="mb-4">
          <Text className="font-['DM Sans'] text-center text-sm text-red-500">
            {forgotPasswordError}
          </Text>
        </View>
      )}

      <Button
        text={isLoading ? t("auth.sendingCode") : t("auth.sendRecoveryPhone")}
        onPress={handleSubmit(handleSendPhone)}
        disabled={!isValid || isLoading}
        className={`${
          isValid && !isLoading ? "bg-[#D38B5D]" : "bg-gray-400"
        } mb-6 flex-row items-center justify-center rounded-[40px] py-3`}
      />

      <Button
        text={t("auth.back")}
        className="items-center"
        onPress={handleBack}
        textStyle="font-['DM Sans'] font-light text-base text-black"
      />
    </View>
  );
};

export default ForgotPassword;
