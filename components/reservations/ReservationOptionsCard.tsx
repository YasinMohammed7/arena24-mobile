import { View, Text, TouchableOpacity } from "react-native";
import { ReservationCardProps } from "@/types/reservations";

export default function ReservationCard({
  icon: Icon,
  title,
  description,
  onPress,
}: ReservationCardProps) {
  return (
    <TouchableOpacity
      className="bg-white rounded-3xl border border-gray-100 flex flex-col items-center gap-5 px-2 py-3 my-3"
      onPress={onPress}
    >
      {/* Icon Container */}
      <View className="flex items-center justify-center">
        <Icon />
      </View>

      {/* Text Content */}
      <View className="flex flex-col items-center gap-1.5">
        <Text className="text-[#492800] text-lg text-center font-['poppins-medium']">
          {title}
        </Text>
        <Text className="text-[#492800] text-sm font-light text-center leading-relaxed font-poppins mx-2">
          {description}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
