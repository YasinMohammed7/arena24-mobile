import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';

interface YesNoSelectorProps {
  question: string;
  value: boolean | null;
  onChange: (value: boolean) => void;
}

export default function YesNoSelector({
  question,
  value,
  onChange,
}: YesNoSelectorProps) {
  const { t } = useLanguage();
  return (
    <View className='mb-6'>
      <Text className="font-['poppins-medium'] text-sm text-[#492800] mb-4">
        {question}
      </Text>

      <View className='flex flex-row justify-center items-center gap-6'>
        {/* NU Button */}
        <TouchableOpacity
          onPress={() => onChange(false)}
          className={`border rounded-xl px-10 py-4 ${
            value === false
              ? 'border-[#D38B5D] bg-[#D38B5D]'
              : 'border-gray-100 bg-white'
          }`}
        >
          <Text
            className={`font-['poppins-medium'] text-base text-center ${
              value === false ? 'text-white' : 'text-black'
            }`}
          >
            {t('common.no')}
          </Text>
        </TouchableOpacity>

        {/* DA Button */}
        <TouchableOpacity
          onPress={() => onChange(true)}
          className={`rounded-xl px-10 py-4 flex-row items-center justify-center ${
            value === true
              ? 'bg-[#D38B5D] border border-[#D38B5D]'
              : 'bg-white border border-gray-100'
          }`}
        >
          <Text
            className={`font-['poppins-medium'] text-base text-center ${
              value === true ? 'text-white' : 'text-black'
            }`}
          >
            {t('common.yes')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
