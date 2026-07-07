import { View, ScrollView } from "react-native";
import Button from "@/components/shared/Button";
import { PersonNumberSelectorProps } from "@/types/personNumberSelector";

const PersonNumberSelector = ({
  onSelectNumber,
  selectedNumber,
  maxNumber = 12,
  minNumber = 1,
}: PersonNumberSelectorProps) => {
  const numbers = Array.from(
    { length: maxNumber - minNumber + 1 },
    (_, i) => i + minNumber
  );

  const handleNumberSelect = (number: number) => {
    if (onSelectNumber) {
      onSelectNumber(number);
    }
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 2 }}
      className="mt-2"
    >
      <View className="flex-row gap-2.5">
        {numbers.map((number) => (
          <Button
            key={number}
            text={number.toString()}
            onPress={() => handleNumberSelect(number)}
            className={`h-12 w-12 items-center justify-center rounded-full border border-gray-100 ${
              selectedNumber === number ? "bg-[#D38B5D]" : "bg-white"
            }`}
            textStyle={`font-['poppins-medium'] text-sm ${
              selectedNumber === number ? "text-white" : "text-[#000000]"
            }`}
          />
        ))}
      </View>
    </ScrollView>
  );
};

export default PersonNumberSelector;
