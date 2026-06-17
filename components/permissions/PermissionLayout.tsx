import { View, Text, TouchableOpacity } from 'react-native';
import type { PermissionLayoutProps } from '@/types/permissions';
import { useLanguage } from '@/hooks/useLanguage';

export default function PermissionLayout({
  title,
  description,
  buttonText,
  onButtonPress,
  isLoading = false,
  children,
}: PermissionLayoutProps) {
  const { t } = useLanguage();

  return (
    <View className='flex-1 justify-center items-center p-6'>
      <Text className='text-lg font-medium text-center mb-4'>{title}</Text>
      <Text className='text-sm text-center mb-6 text-gray-600'>
        {description}
      </Text>
      {children}
      <TouchableOpacity
        className='bg-[#D38B5D] px-6 py-3 rounded-full'
        onPress={onButtonPress}
        disabled={isLoading}
      >
        <Text className='text-white font-medium'>
          {isLoading ? t('common.loading') : buttonText}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
