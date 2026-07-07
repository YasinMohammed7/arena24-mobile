import { SafeAreaView } from "react-native-safe-area-context";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { useEffect } from "react";
import SearchBar from "@/components/offers/SearchBar";
import OfferCard from "@/components/offers/OfferCard";
import { useOffersStore } from "@/zustand/offersStore";
import { useRefresh } from "@/hooks/useRefresh";
import { useLanguage } from "@/hooks/useLanguage";

export default function OffersScreen() {
  const { t } = useLanguage();

  const handleSearchChange = (text: string): void => {
    // Handle search text change
    console.log("Search text:", text);
  };

  const handleFilterPress = (): void => {
    // Handle filter button press
    console.log("Filter pressed");
  };

  const offers = useOffersStore((state) => state.offers);
  const isLoading = useOffersStore((state) => state.isLoading);
  const error = useOffersStore((state) => state.error);
  const fetchOffers = useOffersStore((state) => state.fetchOffers);

  // Pull-to-refresh functionality
  const { refreshing, onRefresh } = useRefresh({
    onRefresh: fetchOffers,
  });

  useEffect(() => {
    fetchOffers();
  }, [fetchOffers]);

  return (
    <SafeAreaView
      edges={["top", "left", "right"]}
      className="flex-1 bg-white px-5"
    >
      {/* Search Bar */}
      <SearchBar
        placeholder={t("offers.searchPlaceholder")}
        onChangeText={handleSearchChange}
        onFilterPress={handleFilterPress}
      />

      {/* <OffersCategory /> */}

      {/* Offers List */}
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : error ? (
        <View className="flex-1 items-center justify-center">
          <Text className="py-4 text-center font-['poppins-regular'] text-sm text-red-500">
            {error}
          </Text>
        </View>
      ) : (
        <FlatList
          data={offers}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <OfferCard offer={item} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            marginTop: 20,
            paddingBottom: 30,
            gap: 16,
          }}
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      )}
    </SafeAreaView>
  );
}
