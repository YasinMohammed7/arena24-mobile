import { View, Text } from "react-native";
import Button from "@/components/shared/Button";
import { useEffect } from "react";
import { Href, router } from "expo-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "@/components/auth/FormInput";
import PasswordInput from "@/components/auth/PasswordInput";
import FormLabel from "@/components/auth/FormLabel";
import { getLoginSchema, LoginFormData } from "@/schemas/authSchemas";
import { useAuthStore } from "@/zustand/authStore";
import { useLanguage } from "@/hooks/useLanguage";

const LoginScreen = () => {
  const { t } = useLanguage();

  const {
    control,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(getLoginSchema()),
    mode: "all",
    reValidateMode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const loginUser = useAuthStore((state) => state.loginUser);
  const isLoading = useAuthStore((state) => state.isLoading);
  const loginError = useAuthStore((state) => state.loginError);
  const clearErrors = useAuthStore((state) => state.clearErrors);
  const setLoginSuccess = useAuthStore((state) => state.setLoginSuccess);
  const loginSuccess = useAuthStore((state) => state.loginSuccess);
  const redirectAfterLogin = useAuthStore((state) => state.redirectAfterLogin);
  const setRedirectAfterLogin = useAuthStore(
    (state) => state.setRedirectAfterLogin
  );
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // Handle navigation after successful login
  useEffect(() => {
    if (isAuthenticated && loginSuccess) {
      // Clear success state
      setLoginSuccess(false);

      // Check if there's a redirect path, otherwise go to main app
      if (redirectAfterLogin) {
        const redirectPath = redirectAfterLogin;
        setRedirectAfterLogin(null); // Clear the redirect path
        router.replace(redirectPath as Href);
      } else {
        router.replace("/(navigationBar)");
      }
    }
  }, [
    isAuthenticated,
    loginSuccess,
    redirectAfterLogin,
    setLoginSuccess,
    setRedirectAfterLogin,
  ]);

  const onSubmit = async (data: any) => {
    clearErrors();
    const success = await loginUser(data);
    if (success) {
      console.log("Login successful");
      // Navigation will be handled by useEffect above
    }
  };

  const handleFormSubmit = async () => {
    const isValid = await trigger();
    if (isValid) {
      await handleSubmit(onSubmit)();
    }
  };

  return (
    <View>
      {loginError && (
        <View className="mb-4 p-3 bg-red-50 rounded border border-red-200">
          <Text className="text-red-600 text-sm text-center">{loginError}</Text>
        </View>
      )}
      {/* Email and Password Fields */}
      <View className="mb-11">
        {/* Email Field */}
        <FormInput
          name="email"
          control={control}
          label={t("auth.email") + "*"}
          placeholder={t("auth.emailPlaceholder")}
          error={errors.email}
          keyboardType="email-address"
          autoCapitalize="none"
          maxLength={254}
        />

        {/* Password Field */}
        <View>
          <View className="flex-row justify-between items-center">
            <FormLabel
              label={t("auth.passwordLabel")}
              error={errors.password}
            />
            <Button
              text={t("auth.forgotPassword")}
              onPress={() => router.push("/(auth)/forgotPassword")}
              textStyle="text-black underline font-['DM Sans'] text-sm mb-2 ml-2"
              className="ml-2"
            />
          </View>
          <PasswordInput
            name="password"
            control={control}
            label=""
            placeholder={t("auth.yourPassword")}
            error={errors.password}
            showToggle={false}
            maxLength={128}
          />
        </View>
      </View>

      {/* Error Message */}

      {/* Action Button */}
      <Button
        text={isLoading ? t("common.loading") : t("auth.login")}
        className={`rounded-[40px] py-3 items-center mb-6 ${
          isLoading ? "bg-gray-400" : "bg-[#D38B5D]"
        }`}
        onPress={handleFormSubmit}
        disabled={isLoading}
      />

      {/* Bottom Text */}
      <View className="flex-row justify-center items-center">
        <Text className="font-['DM Sans'] text-base font-light text-black">
          {t("auth.dontHaveAccountYet")}{" "}
        </Text>
        <Button
          text={t("auth.createAccount")}
          onPress={() => router.push("/register")}
          textStyle="text-[#D38B5D] underline font-['DM Sans'] text-base font-light"
        />
      </View>
    </View>
  );
};

export default LoginScreen;
