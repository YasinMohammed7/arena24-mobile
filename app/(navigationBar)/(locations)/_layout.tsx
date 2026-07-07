import { Slot } from "expo-router";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const LocationsLayout = () => {
  return (
    <SafeAreaView
      className="flex-1 bg-white px-5"
      edges={["top", "left", "right"]}
    >
      <View className="flex-1">
        <Slot />
      </View>
    </SafeAreaView>
  );
};

export default LocationsLayout;
