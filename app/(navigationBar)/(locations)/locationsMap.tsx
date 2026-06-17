import { View } from "react-native";
import Map from "@/components/locations/Map";
import { LocationListItemWithCoordinates } from "@/types/locations";
import { useLocationsStore } from "@/zustand/locationsStore";
// import TestConnection from "@/components/TestConnection";

export default function LocationsMap() {
  const locations = useLocationsStore(
    (state) => state.locations
  ) as LocationListItemWithCoordinates[];
  return (
    <View className="flex-1 my-5">
      <Map locations={locations} />
      {/* <TestConnection /> */}
    </View>
  );
}
