import { Text, View } from "react-native";

interface CustomMarkerProps {
  currentValue: number;
  um: string;
}

const CustomMarker = ({ currentValue, um }: CustomMarkerProps) => (
  <View className="items-center">
    <View
      // Dispare markerul daca stilizez cu nativewind
      style={{
        height: 28,
        width: 28,
        borderRadius: 14,
        borderWidth: 2,
        borderColor: "#D38B5D",
        backgroundColor: "#fff",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
        marginTop: 15,
      }}
    />
    <Text
      style={{
        color: "#492800B2",
        fontFamily: "poppins-regular",
        fontSize: 12,
      }}
    >
      {currentValue} {um}
    </Text>
  </View>
);

export default CustomMarker;
