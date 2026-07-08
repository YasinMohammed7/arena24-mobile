import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  getEmailRegistrationSchema,
  EmailRegistrationFormData,
} from "@/schemas/authSchemas";
import { useAuthStore } from "@/zustand/authStore";
import Button from "@/components/shared/Button";
import { useLanguage } from "@/hooks/useLanguage";

const RegisterScreen = () => {
  const { t } = useLanguage();

  const {
    sendVerificationCode,
    isLoading,
    sendVerificationError,
    clearErrors,
  } = useAuthStore();

  const {
    control,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<EmailRegistrationFormData>({
    resolver: zodResolver(getEmailRegistrationSchema()),
    mode: "all",
    reValidateMode: "onChange",
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: EmailRegistrationFormData) => {
    try {
      // Clear any previous errors
      clearErrors();

      // Send verification code
      await sendVerificationCode({ contact: data.email });

      // Navigate to confirmation screen
      router.push({
        pathname: "/confirmCode",
        params: { email: data.email },
      });
    } catch (error: any) {
      // Error is already handled in the store
      console.log("Error sending verification code:", error);
      return;
    }
  };

  const handleFormSubmit = async () => {
    const isValid = await trigger();
    if (isValid) {
      handleSubmit(onSubmit)();
    }
  };

  return (
    <View>
      {/* Email Input */}
      <View className="mb-8">
        <Text
          className={`font-['DM Sans'] mb-2 ml-3 text-sm font-light ${
            errors.email || sendVerificationError
              ? "text-[#E50101]"
              : "text-black"
          }`}
        >
          {errors.email?.message || t("auth.email")}
        </Text>
        <View className="flex-row items-center rounded-[11px] border border-[#EBEBEB] px-3">
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <TextInput
                className="font-['DM Sans'] flex-1 py-3 text-sm font-medium text-black"
                placeholder={t("auth.emailPlaceholder")}
                placeholderTextColor="#B7B7B7"
                value={value}
                onChangeText={onChange}
                keyboardType="email-address"
                autoCapitalize="none"
                maxLength={254}
              />
            )}
          />
        </View>
      </View>

      {/* Error Message */}
      {sendVerificationError && (
        <View className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3">
          <Text className="font-['DM Sans'] text-center text-sm text-red-700">
            {sendVerificationError}
          </Text>
        </View>
      )}

      {/* Send Code Button */}
      <Button
        text={isLoading ? t("auth.sendingCode") : t("auth.sendCode")}
        onPress={handleFormSubmit}
        disabled={isLoading}
        className={`mb-6 items-center rounded-[40px] py-3 ${
          isLoading ? "bg-gray-400" : "bg-[#D38B5D]"
        }`}
      />

      {/* Bottom Text */}
      <View className="flex-row items-center justify-center">
        <Text className="font-['DM Sans'] text-base font-light text-black">
          {t("auth.alreadyHaveAccountQuestion")}{" "}
        </Text>
        <TouchableOpacity onPress={() => router.push("/login")}>
          <Text className="font-['DM Sans'] text-base font-light text-[#D38B5D] underline">
            {t("auth.authenticate")}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default RegisterScreen;
