import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TextInputProps,
} from 'react-native';
import { useState } from 'react';
import {
  Controller,
  Control,
  FieldError,
  RegisterOptions,
} from 'react-hook-form';
import { useLanguage } from '@/hooks/useLanguage';

interface PasswordInputProps
  extends Omit<TextInputProps, 'value' | 'onChangeText' | 'secureTextEntry'> {
  name: string;
  control: Control<any>;
  label: string;
  placeholder: string;
  error?: FieldError;
  clearErrorOnChange?: (
    onChange: (value: string) => void
  ) => (value: string) => void;
  showToggle?: boolean;
  rules?: RegisterOptions;
}

const PasswordInput = ({
  name,
  control,
  label,
  placeholder,
  error,
  clearErrorOnChange,
  showToggle = true,
  rules,
  ...textInputProps
}: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const { t } = useLanguage();

  return (
    <View className={label ? 'mb-6' : ''}>
      {label && (
        <Text
          className={`font-['DM Sans'] text-sm mb-2 ml-3 ${
            error ? 'text-[#E50101]' : 'text-black'
          }`}
        >
          {label}
        </Text>
      )}
      <View className='flex-row items-center border border-[#EBEBEB] rounded-[11px] px-3'>
        <Controller
          control={control}
          name={name}
          rules={rules}
          render={({ field: { onChange, value } }) => (
            <TextInput
              className="flex-1 font-['DM Sans'] text-sm font-medium text-black py-3"
              placeholder={placeholder}
              placeholderTextColor='#B7B7B7'
              value={value}
              onChangeText={
                clearErrorOnChange ? clearErrorOnChange(onChange) : onChange
              }
              secureTextEntry={!showPassword}
              autoCapitalize='none'
              autoCorrect={false}
              {...textInputProps}
            />
          )}
        />
        {showToggle && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            className='ml-2'
          >
            <Text className="font-['DM Sans'] text-sm text-[#B7B7B7]">
              {showPassword ? t('auth.hide') : t('auth.show')}
            </Text>
          </TouchableOpacity>
        )}
      </View>
      {error && (
        <Text className="font-['DM Sans'] text-xs mt-1 ml-3 text-[#E50101]">
          {error.message}
        </Text>
      )}
    </View>
  );
};

export default PasswordInput;
