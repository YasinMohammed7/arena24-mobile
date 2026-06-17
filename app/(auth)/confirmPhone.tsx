import { View, Text, TouchableOpacity } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useState, useEffect } from 'react';
import MessageCodeField from '@/components/auth/MessageCodeField';
import { useAuthStore } from '@/zustand/authStore';
import { useLanguage } from '@/hooks/useLanguage';

export default function ConfirmPhone() {
  const { t } = useLanguage();
  const { phone } = useLocalSearchParams<{ phone?: string }>();
  const {
    sendVerificationSuccess,
    setSendVerificationSuccess,
    sendVerificationCode,
    verifyPhoneNumber,
    verifyPhoneNumberError,
    isLoading,
    setLoading,
  } = useAuthStore();
  const [code, setCode] = useState('');

  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds = 1 minute
  const [canResend, setCanResend] = useState(false);

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
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  const handleResend = async () => {
    // Immediately gate by isLoading and canResend
    if (isLoading || !canResend || !phone) return;

    // Clear any previous errors and disable resend
    setCanResend(false);
    setLoading(true);

    try {
      await sendVerificationCode({ contact: phone });
      // Reset timer after successful resend and keep canResend false until timer expires
      setTimeLeft(60);
    } catch (error: any) {
      // Log error with non-shadowing variable name
      console.error('Error resending verification code:', error);

      // Re-enable canResend on failure
      setCanResend(true);
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
      if (!phone) {
        return;
      }
      const response = await verifyPhoneNumber({ contact: phone, code });

      if (response.valid) {
        // Verification successful, redirect to complete registration
        router.push({
          pathname: '/completeRegistration',
          params: { phone },
        });
      }
    } catch (error) {
      // Error handling is already done in the store via verifyPhoneNumberError
    }
  };

  return (
    <View>
      {/* Success Message */}
      {sendVerificationSuccess && (
        <View className='mb-4 p-3 bg-green-50 border border-green-200 rounded-lg'>
          <Text className="font-['DM Sans'] text-sm text-green-700 text-center">
            {t('auth.smsCodeSentSuccess')}
            {phone
              ? ` ${String(phone).slice(0, 3)}${'•'.repeat(
                  Math.max(0, String(phone).length - 6)
                )}${String(phone).slice(-3)}`
              : ''}
            !
          </Text>
        </View>
      )}

      {/* Header */}
      <Text className="font-['Poppins-medium'] text-black text-center mb-2">
        {t('auth.validatePhoneNumber')}
      </Text>

      {/* Subtitle */}
      <Text className="font-['DM Sans'] text-sm font-light text-black text-center mb-6 px-4">
        {t('auth.enterFourDigitCode')}
      </Text>

      <MessageCodeField
        value={code}
        onChangeText={(text) => {
          const digits = text.replace(/\D/g, '').slice(0, 4);
          setCode(digits);
        }}
        error={verifyPhoneNumberError || undefined}
        autoFocus={true}
      />

      {/* Resend functionality */}
      <View className='flex-row justify-end items-center mt-4 mb-10'>
        <Text className="font-['DM Sans'] text-sm font-light text-black">
          {t('auth.didntReceiveCode')}{' '}
        </Text>
        {canResend ? (
          <TouchableOpacity onPress={handleResend} disabled={isLoading}>
            <Text
              className={`underline font-['DM Sans'] text-sm ${
                isLoading ? 'text-gray-400' : 'text-black'
              }`}
            >
              {isLoading ? t('auth.sendingCode') : t('auth.resendCode')}
            </Text>
          </TouchableOpacity>
        ) : (
          <Text className="font-['DM Sans'] text-sm text-gray-500">
            {t('auth.resendCode')} ({Math.floor(timeLeft / 60)}:
            {(timeLeft % 60).toString().padStart(2, '0')})
          </Text>
        )}
      </View>

      {/* Confirm Button */}
      <TouchableOpacity
        onPress={handleVerify}
        className={`rounded-[40px] py-3 items-center mb-2 ${
          code.length === 4 ? 'bg-[#D38B5D]' : 'bg-gray-400'
        }`}
        disabled={code.length !== 4}
      >
        <Text className="font-['DM Sans'] text-sm font-semibold text-white">
          {t('auth.verify')}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
