import { View, Text, TouchableOpacity } from "react-native";
import React from "react";

interface CheckboxProps {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  className?: string;
}

export default function Checkbox({
  label,
  value,
  onValueChange,
  className = "",
}: CheckboxProps) {
  return (
    <TouchableOpacity
      onPress={() => onValueChange(!value)}
      className={`flex-row items-center mb-4 ${className}`}
    >
      <View
        className={`w-5 h-5 border-2 rounded mr-3 flex items-center justify-center ${
          value ? "bg-[#D38B5D] border-[#D38B5D]" : "bg-white border-gray-300"
        }`}
      />
      <Text className="font-['poppins-medium'] text-sm text-[#000000]">
        {label}
      </Text>
    </TouchableOpacity>
  );
}
