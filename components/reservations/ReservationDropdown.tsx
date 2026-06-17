import { View, Text, TouchableOpacity } from "react-native";
import { useEffect } from "react";
import { ChevronDown } from "lucide-react-native";
import { ReservationDropdownProps } from "@/types/reservations";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  LinearTransition,
  SlideInDown,
  SlideOutUp,
} from "react-native-reanimated";

export default function ReservationDropdown({
  icon: Icon,
  text,
  onPress,
  isExpanded = false,
  children,
}: ReservationDropdownProps) {
  const progress = useSharedValue(isExpanded ? 1 : 0);

  // Sync animation with isExpanded prop changes
  useEffect(() => {
    progress.value = withTiming(isExpanded ? 1 : 0, {
      duration: 350,
    });
  }, [isExpanded, progress]);

  const handlePress = () => {
    onPress?.();
  };

  // Animated style for the chevron rotation
  const chevronAnimatedStyle = useAnimatedStyle(() => {
    const rotation = interpolate(progress.value, [0, 1], [0, 180]);

    return {
      transform: [{ rotate: `${rotation}deg` }],
    };
  });

  return (
    <Animated.View
      layout={LinearTransition.duration(300)}
      className="bg-white border border-[#f1f1f1] rounded-2xl flex flex-col"
    >
      <TouchableOpacity className="p-3" onPress={handlePress}>
        {/* Header: Icon, Text, and Arrow */}
        <View className="flex flex-row justify-between items-center">
          {/* Left side: Icon and Text */}
          <View className="flex flex-row items-center gap-2">
            {/* Icon Container */}
            <View className="flex items-center justify-center w-6 h-6">
              <Icon width={16} height={16} />
            </View>

            {/* Text */}
            <Text className="text-[#492800] text-sm font-medium font-['poppins-medium']">
              {text}
            </Text>
          </View>

          {/* Right side: Arrow Down with rotation animation */}
          <View className="w-5 h-5 flex items-center justify-center">
            <Animated.View style={chevronAnimatedStyle}>
              <ChevronDown size={18} color="#492800" strokeWidth={1.5} />
            </Animated.View>
          </View>
        </View>
      </TouchableOpacity>

      {/* Expandable content with smooth entering/exiting animations */}
      {isExpanded && children && (
        <Animated.View className="px-3 pb-3">{children}</Animated.View>
      )}
    </Animated.View>
  );
}
