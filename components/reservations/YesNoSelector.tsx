import { View, Text, TouchableOpacity } from "react-native";
import { useLanguage } from "@/hooks/useLanguage";

interface YesNoSelectorProps {
  question: string;
  value: boolean | null;
  onChange: (value: boolean) => void;
}

export default function YesNoSelector({
  question,
  value,
  onChange,
}: YesNoSelectorProps) {
  const { t } = useLanguage();
  return (
    <View className="mb-6">
      <Text className="mb-4 font-['poppins-medium'] text-sm text-[#492800]">
        {question}
      </Text>

      <View className="flex flex-row items-center justify-center gap-6">
        {/* NU Button */}
        <TouchableOpacity
          onPress={() => onChange(false)}
          className={`rounded-xl border px-10 py-4 ${
            value === false
              ? "border-[#D38B5D] bg-[#D38B5D]"
              : "border-gray-100 bg-white"
          }`}
        >
          <Text
            className={`text-center font-['poppins-medium'] text-base ${
              value === false ? "text-white" : "text-black"
            }`}
          >
            {t("common.no")}
          </Text>
        </TouchableOpacity>

        {/* DA Button */}
        <TouchableOpacity
          onPress={() => onChange(true)}
          className={`flex-row items-center justify-center rounded-xl px-10 py-4 ${
            value === true
              ? "border border-[#D38B5D] bg-[#D38B5D]"
              : "border border-gray-100 bg-white"
          }`}
        >
          <Text
            className={`text-center font-['poppins-medium'] text-base ${
              value === true ? "text-white" : "text-black"
            }`}
          >
            {t("common.yes")}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
