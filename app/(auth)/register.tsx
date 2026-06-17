import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getPhoneSchema, PhoneFormData } from "@/schemas/authSchemas";
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
  } = useForm<PhoneFormData>({
    resolver: zodResolver(getPhoneSchema()),
    mode: "all",
    reValidateMode: "onChange",
    defaultValues: {
      phone: "",
    },
  });

  const onSubmit = async (data: PhoneFormData) => {
    try {
      // Clear any previous errors
      clearErrors();

      // Send verification code
      await sendVerificationCode({ contact: data.phone });

      // Navigate to phone confirmation screen
      router.push({
        pathname: "/confirmPhone",
        params: { phone: data.phone },
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
      {/* Error Message */}
      {sendVerificationError && (
        <View className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <Text className="font-['DM Sans'] text-sm text-red-600">
            {sendVerificationError}
          </Text>
        </View>
      )}

      {/* Phone Number Input */}
      <View className="mb-8">
        <Text
          className={`font-['DM Sans'] text-sm font-light mb-2 ml-3 ${
            errors.phone || sendVerificationError
              ? "text-[#E50101]"
              : "text-black"
          }`}
        >
          {errors.phone?.message || t("auth.phoneNumberRequired")}
        </Text>
        <View className="flex-row items-center border border-[#EBEBEB] rounded-[11px] px-3">
          {/* <Text className="font-['DM Sans'] text-sm font-medium text-black mr-3">
            +40
          </Text> */}
          <Controller
            control={control}
            name="phone"
            render={({ field: { onChange, value } }) => (
              <TextInput
                className="flex-1 font-['DM Sans'] text-sm font-medium text-black py-3"
                placeholder={t("auth.enterPhoneNumber")}
                placeholderTextColor="#B7B7B7"
                value={value}
                onChangeText={onChange}
                keyboardType="phone-pad"
                maxLength={20}
              />
            )}
          />
        </View>
      </View>

      {/* Error Message */}
      {sendVerificationError && (
        <View className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <Text className="font-['DM Sans'] text-sm text-red-700 text-center">
            {sendVerificationError}
          </Text>
        </View>
      )}

      {/* SMS Button */}
      <Button
        text={isLoading ? t("auth.sendingSMS") : t("auth.sendSMSCode")}
        onPress={handleFormSubmit}
        disabled={isLoading}
        className={`rounded-[40px] py-3 items-center mb-6 ${
          isLoading ? "bg-gray-400" : "bg-[#D38B5D]"
        }`}
      />

      {/* Bottom Text */}
      <View className="flex-row justify-center items-center">
        <Text className="font-['DM Sans'] text-base font-light text-black">
          {t("auth.alreadyHaveAccountQuestion")}{" "}
        </Text>
        <TouchableOpacity onPress={() => router.push("/login")}>
          <Text className="text-[#D38B5D] underline font-['DM Sans'] text-base font-light">
            {t("auth.authenticate")}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default RegisterScreen;
