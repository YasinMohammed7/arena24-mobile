import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Slot } from "expo-router";

const ReservationsLayout = () => {
  return (
    <SafeAreaView
      className="flex-1 bg-white px-5 py-4"
      edges={["top", "left", "right"]}
    >
      <View className="flex-1">
        <Slot />
      </View>
    </SafeAreaView>
  );
};

export default ReservationsLayout;
