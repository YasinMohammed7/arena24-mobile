import { View, Text, TextInput, TextInputProps } from "react-native";
import { Controller, Control, FieldError } from "react-hook-form";
import React from "react";

interface FormInputProps
  extends Omit<TextInputProps, "value" | "onChangeText"> {
  name: string;
  control: Control<any>;
  label: string;
  placeholder: string;
  error?: FieldError;
  clearErrorOnChange?: (
    onChange: (value: string) => void
  ) => (value: string) => void;
  inputRef?: React.RefObject<TextInput | null>;
}

const FormInput = ({
  name,
  control,
  label,
  placeholder,
  error,
  className,
  clearErrorOnChange,
  inputRef,
  ...textInputProps
}: FormInputProps) => {
  return (
    <View className="mb-6">
      {label && (
        <Text
          className={`font-['DM Sans'] text-sm mb-2 ml-3 ${
            error ? "text-[#E50101]" : "text-black"
          }`}
        >
          {label}
        </Text>
      )}
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value } }) => (
          <TextInput
            ref={inputRef}
            className={
              className ||
              "border border-[#EBEBEB] rounded-[11px] px-3 py-3 font-['DM Sans'] text-sm font-medium text-black"
            }
            placeholder={placeholder}
            placeholderTextColor="#B7B7B7"
            value={value}
            onChangeText={
              clearErrorOnChange ? clearErrorOnChange(onChange) : onChange
            }
            {...textInputProps}
          />
        )}
      />
      {error && (
        <Text className="font-['DM Sans'] text-xs mt-1 ml-3 text-[#E50101]">
          {error.message}
        </Text>
      )}
    </View>
  );
};

export default FormInput;
