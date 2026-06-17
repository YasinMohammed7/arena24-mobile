import { View, Text, TouchableOpacity, Image } from 'react-native';
import { AmenityCardProps } from '@/types/locations';
import { SvgUri } from 'react-native-svg';
import { useLanguage } from '@/hooks/useLanguage';

const AmenityCard = ({
  title,
  description,
  icon,
  onPress,
  disabled = false,
}: AmenityCardProps) => {
  const { t } = useLanguage();

  return (
    <TouchableOpacity
      className={`rounded-2xl border p-3 shadow-sm ${
        disabled
          ? 'bg-gray-100 border-gray-200 opacity-60'
          : 'bg-white border-[#F1F1F1]'
      }`}
      accessible={true}
      accessibilityRole='button'
      accessibilityLabel={title}
      accessibilityHint={
        disabled
          ? `${title} ${t('locations.isUnavailable')}`
          : `${t('locations.doubleTapTo')} ${description}`
      }
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
    >
      <View className='flex flex-row items-center gap-4'>
        {/* Icon Container */}
        <View className='rounded-lg items-center justify-center'>
          {icon && icon.includes('.svg') ? (
            <SvgUri uri={`${process.env.EXPO_PUBLIC_API_BASE_URL}${icon}`} />
          ) : (
            <Image
              source={{ uri: `${process.env.EXPO_PUBLIC_API_BASE_URL}${icon}` }}
              className='w-10 h-10'
              resizeMode='contain'
            />
          )}
        </View>

        {/* Text Container */}
        <View className='flex-1'>
          <Text
            className={`font-['poppins-medium'] text-sm leading-5 ${
              disabled ? 'text-gray-400' : 'text-[#000000]'
            }`}
          >
            {title}
          </Text>
          <Text
            className={`font-['poppins-light'] text-xs leading-4 mt-0.5 ${
              disabled ? 'text-gray-400' : 'text-[#000000]'
            }`}
          >
            {description}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default AmenityCard;
