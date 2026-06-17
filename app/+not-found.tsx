import { View, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLanguage } from '@/hooks/useLanguage';

export default function NotFoundScreen() {
  const { t } = useLanguage();
  const handleGoHome = () => {
    router.replace('/(navigationBar)');
  };

  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(navigationBar)');
    }
  };

  return (
    <SafeAreaView className='flex-1 bg-[#D38B5D14]'>
      <View className='flex-1 justify-center items-center px-6'>
        {/* 404 Number */}
        <Text className="font-['poppins-bold'] text-6xl text-[#492800] mb-4">
          404
        </Text>

        {/* Main Title */}
        <Text className="font-['poppins-semibold'] text-2xl text-[#492800] text-center mb-3">
          {t('notFound.title')}
        </Text>

        {/* Description */}
        <Text className="font-['poppins-regular'] text-base text-[#492800] opacity-70 text-center mb-8 leading-6">
          {t('notFound.description')}
        </Text>

        {/* Buttons Container */}
        <View className='flex gap-3 w-full max-w-xs space-y-4'>
          {/* Go Home Button */}
          <TouchableOpacity
            onPress={handleGoHome}
            className='bg-[#492800] rounded-xl py-4 px-6 items-center'
            activeOpacity={0.8}
          >
            <Text className="font-['poppins-medium'] text-white text-base">
              {t('notFound.goHome')}
            </Text>
          </TouchableOpacity>

          {/* Go Back Button */}
          <TouchableOpacity
            onPress={handleGoBack}
            className='border border-[#D38B5D] rounded-xl py-4 px-6 items-center'
            activeOpacity={0.8}
          >
            <Text className="font-['poppins-medium'] text-[#492800] text-base">
              {t('notFound.goBack')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
