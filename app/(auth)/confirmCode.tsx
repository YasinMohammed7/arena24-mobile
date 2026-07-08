import { View, Text, TouchableOpacity } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useState, useEffect } from "react";
import MessageCodeField from "@/components/auth/MessageCodeField";
import { useAuthStore } from "@/zustand/authStore";
import { useLanguage } from "@/hooks/useLanguage";

export default function ConfirmCode() {
  const { t } = useLanguage();
  const { email } = useLocalSearchParams<{ email?: string }>();
  const {
    sendVerificationSuccess,
    setSendVerificationSuccess,
    sendVerificationCode,
    verifyPhoneNumber,
    verifyPhoneNumberError,
    isLoading,
    setLoading,
  } = useAuthStore();
  const [code, setCode] = useState("");

  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds = 1 minute
  const canResend = timeLeft === 0;

  // Show success message when arriving from successful verification code send
  useEffect(() => {
    if (sendVerificationSuccess) {
      // Auto-hide success message after 5 seconds
      const timer = setTimeout(() => {
        setSendVerificationSuccess(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [sendVerificationSuccess, setSendVerificationSuccess]);

  // Timer countdown for resend functionality
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const handleResend = async () => {
    // Immediately gate by isLoading and canResend
    if (isLoading || !canResend || !email) return;

    // Clear any previous errors and disable resend
    setLoading(true);

    try {
      await sendVerificationCode({ contact: email });
      // Reset timer after successful resend
      setTimeLeft(60);
    } catch (error: any) {
      // Log error with non-shadowing variable name
      console.error("Error resending verification code:", error);

      // Allow immediate retry on failure
      setTimeLeft(0);
    } finally {
      // Reset loading state
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!/^\d{4}$/.test(code)) {
      return;
    }

    try {
      if (!email) {
        return;
      }
      const response = await verifyPhoneNumber({ contact: email, code });

      if (response.valid) {
        // Verification successful, redirect to complete registration
        router.push({
          pathname: "/completeRegistration",
          params: { email },
        });
      }
    } catch (error) {
      console.error("Error verifying code:", error);
    }
  };

  return (
    <View>
      {/* Success Message */}
      {sendVerificationSuccess && (
        <View className="mb-4 rounded-lg border border-green-200 bg-green-50 p-3">
          <Text className="font-['DM Sans'] text-center text-sm text-green-700">
            {t("auth.codeSentSuccess")} {email}!
          </Text>
        </View>
      )}

      {/* Header */}
      <Text className="mb-2 text-center font-['Poppins-medium'] text-black">
        {t("auth.verifyCodeTitle")}
      </Text>

      {/* Subtitle */}
      <Text className="font-['DM Sans'] mb-6 px-4 text-center text-sm font-light text-black">
        {t("auth.enterCode")}
      </Text>

      <MessageCodeField
        value={code}
        onChangeText={(text) => {
          const digits = text.replace(/\D/g, "").slice(0, 4);
          setCode(digits);
        }}
        error={verifyPhoneNumberError || undefined}
        autoFocus={true}
      />

      {/* Resend functionality */}
      <View className="mb-10 mt-4 flex-row items-center justify-end">
        <Text className="font-['DM Sans'] text-sm font-light text-black">
          {t("auth.didntReceiveCode")}{" "}
        </Text>
        {canResend ? (
          <TouchableOpacity onPress={handleResend} disabled={isLoading}>
            <Text
              className={`font-['DM Sans'] text-sm underline ${
                isLoading ? "text-gray-400" : "text-black"
              }`}
            >
              {isLoading ? t("auth.sendingCode") : t("auth.resendCode")}
            </Text>
          </TouchableOpacity>
        ) : (
          <Text className="font-['DM Sans'] text-sm text-gray-500">
            {t("auth.resendCode")} ({Math.floor(timeLeft / 60)}:
            {(timeLeft % 60).toString().padStart(2, "0")})
          </Text>
        )}
      </View>

      {/* Confirm Button */}
      <TouchableOpacity
        onPress={handleVerify}
        className={`mb-2 items-center rounded-[40px] py-3 ${
          code.length === 4 ? "bg-[#D38B5D]" : "bg-gray-400"
        }`}
        disabled={code.length !== 4}
      >
        <Text className="font-['DM Sans'] text-sm font-semibold text-white">
          {t("auth.verify")}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
