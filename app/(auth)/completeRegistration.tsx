import { View, Text, TouchableOpacity } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "@/zustand/authStore";
import FormInput from "@/components/auth/FormInput";
import PasswordInput from "@/components/auth/PasswordInput";
import {
  getCompleteRegistrationSchema,
  CompleteRegistrationFormData,
} from "@/schemas/authSchemas";
import Button from "@/components/shared/Button";
import { useLanguage } from "@/hooks/useLanguage";

const CompleteRegistrationScreen = () => {
  const { t } = useLanguage();
  const { phone } = useLocalSearchParams<{ phone: string }>();

  // Get register method and loading state from Auth store with selectors for performance
  const registerUser = useAuthStore((state) => state.registerUser);
  const loginUser = useAuthStore((state) => state.loginUser);
  const isLoading = useAuthStore((state) => state.isLoading);
  const registrationSuccess = useAuthStore(
    (state) => state.registrationSuccess
  );
  const registrationError = useAuthStore((state) => state.registrationError);
  const clearErrors = useAuthStore((state) => state.clearErrors);
  const setRegistrationSuccess = useAuthStore(
    (state) => state.setRegistrationSuccess
  );

  const {
    control,
    handleSubmit,
    watch,
    trigger,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(getCompleteRegistrationSchema()),
    mode: "all",
    reValidateMode: "onChange",
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Watch password field to compare with confirm password
  const watchPassword = watch("password");

  // Helper function to clear all errors when user types
  const clearErrorOnChange =
    (onChange: (value: string) => void) => (value: string) => {
      if (registrationError) {
        clearErrors();
      }
      onChange(value);
    };

  const onSubmit = async (data: any): Promise<void> => {
    // Format data for API (exclude confirmPassword, include phone from params)
    const { first_name, last_name, email, password } = data;
    const formattedData = {
      name: `${first_name} ${last_name}`.trim(),
      email: email.trim(),
      password,
      phone: (phone as string) || "",
    };
    try {
      const response = await registerUser(formattedData);
      if (response.status === 201) {
        const loginData = {
          email: formattedData.email.trim(),
          password: formattedData.password,
        };

        const success = await loginUser(loginData);

        if (success) {
          router.push("/");
        }

        setRegistrationSuccess(false);
      }
    } catch (error: any) {
      console.log(error);
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
      {/* Error Display */}
      {registrationError && (
        <View className="mb-4 p-3 bg-red-50 rounded border border-red-200">
          <Text className="text-red-600 text-sm text-center">
            {registrationError}
          </Text>
        </View>
      )}

      {/* Success Display */}
      {registrationSuccess && (
        <View className="mb-4 p-3 bg-green-50 rounded border border-green-200">
          <Text className="text-green-600 text-sm text-center">
            {t("auth.registeredSuccessfully")}
          </Text>
        </View>
      )}

      {/* Phone Number Display */}
      <View className="mb-6">
        <Text className="font-['DM Sans'] text-sm font-light mb-2 ml-3 text-black">
          {t("auth.phoneNumberConfirmed")}
        </Text>
        <View className="border border-green-300 bg-green-50 rounded-[11px] px-3 py-3">
          <Text className="font-['DM Sans'] text-sm font-medium text-green-700">
            {phone}
          </Text>
        </View>
      </View>

      {/* First Name Input */}
      <FormInput
        name="first_name"
        control={control}
        label={t("auth.firstName")}
        placeholder={t("auth.firstNamePlaceholder")}
        error={errors.first_name}
        clearErrorOnChange={clearErrorOnChange}
        autoCapitalize="words"
        autoCorrect={false}
      />

      {/* Last Name Input */}
      <FormInput
        name="last_name"
        control={control}
        label={t("auth.lastName")}
        placeholder={t("auth.lastNamePlaceholder")}
        error={errors.last_name}
        clearErrorOnChange={clearErrorOnChange}
        autoCapitalize="words"
        autoCorrect={false}
      />

      {/* Email Input */}
      <FormInput
        name="email"
        control={control}
        label={t("auth.emailAddress")}
        placeholder={t("auth.emailPlaceholder2")}
        error={errors.email}
        clearErrorOnChange={clearErrorOnChange}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />

      {/* Password Input */}
      <PasswordInput
        name="password"
        control={control}
        label={t("auth.passwordLabel")}
        placeholder={t("auth.passwordPlaceholder2")}
        error={errors.password}
        clearErrorOnChange={clearErrorOnChange}
      />

      {/* Confirm Password Input */}
      <PasswordInput
        name="confirmPassword"
        control={control}
        label={t("auth.confirmPasswordLabel")}
        placeholder={t("auth.confirmPasswordPlaceholder")}
        error={errors.confirmPassword}
        clearErrorOnChange={clearErrorOnChange}
        rules={{
          validate: (value) => {
            if (!value) return t("auth.pleaseConfirmPassword");
            if (value !== watchPassword) return t("auth.passwordsDoNotMatch");
            return true;
          },
        }}
      />

      {/* Create Account Button */}
      <Button
        text={
          isLoading
            ? t("auth.creatingAccount")
            : registrationSuccess
            ? t("auth.redirecting")
            : t("auth.createAccount")
        }
        className={`rounded-[40px] py-3 items-center mb-6 ${
          isLoading || registrationSuccess ? "bg-gray-400" : "bg-[#D38B5D]"
        }`}
        onPress={handleFormSubmit}
        disabled={isLoading || registrationSuccess}
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

export default CompleteRegistrationScreen;
