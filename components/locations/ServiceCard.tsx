import { View, Text, TouchableOpacity } from "react-native";
import { ServiceCardProps } from "@/types/locations";

const ServiceCard = ({
  title,
  icon,
  onPress,
  disabled = false,
}: ServiceCardProps) => {
  return (
    <TouchableOpacity
      className={`rounded-2xl border px-4 py-3 w-[32%] items-center justify-center shadow-sm ${
        disabled
          ? "bg-gray-100 border-gray-200 opacity-60"
          : "bg-white border-[#F1F1F1]"
      }`}
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityHint={
        disabled
          ? `${title} is currently unavailable`
          : `Double tap to ${title}`
      }
    >
      <View className="items-center justify-center mb-2">{icon}</View>
      <Text
        className={`font-['poppins-medium'] text-xs text-center ${
          disabled ? "text-gray-400" : "text-[#000000]"
        }`}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default ServiceCard;
