import React, { useState } from "react";
import { View, Text, TouchableOpacity, Animated } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { useLanguage } from "@/hooks/useLanguage";
import { SUPPORTED_LANGUAGES, SupportedLanguage } from "@/types/i18n";

interface LanguageSwitcherProps {
  showLabels?: boolean;
  className?: string;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  showLabels = true,
  className = "",
}) => {
  const { currentLanguage, switchLanguage } = useLanguage();

  return (
    <View className={`flex flex-row gap-2 ${className}`}>
      {SUPPORTED_LANGUAGES.map((lang) => (
        <TouchableOpacity
          key={lang.code}
          onPress={() => switchLanguage(lang.code)}
          className={`rounded-lg px-4 py-2 ${
            currentLanguage === lang.code ? "bg-[#8B4513]" : "bg-gray-200"
          }`}
        >
          <Text
            className={`font-poppins-medium ${
              currentLanguage === lang.code ? "text-white" : "text-gray-700"
            }`}
          >
            {showLabels ? lang.nativeName : lang.code.toUpperCase()}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export const FloatingLanguageSelector: React.FC = () => {
  const { currentLanguage, switchLanguage } = useLanguage();
  const [translateY] = useState(new Animated.Value(0));
  const [opacity] = useState(new Animated.Value(1));

  const handlePressIn = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -5,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0.8,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <View className="absolute bottom-5 right-5 z-50">
      <Animated.View
        style={{
          transform: [{ translateY }],
          opacity,
        }}
        onTouchStart={handlePressIn}
        onTouchEnd={handlePressOut}
      >
        <Dropdown
          style={{
            width: 46,
            height: 46,
            borderRadius: 28,
            backgroundColor: "#fff",
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 0,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.27,
            shadowRadius: 4.65,
            elevation: 6,
          }}
          containerStyle={{
            backgroundColor: "#FFF",
            borderRadius: 10,
            marginBottom: 8,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.23,
            shadowRadius: 2.62,
            elevation: 4,
            width: 100,
          }}
          data={SUPPORTED_LANGUAGES}
          labelField="flag"
          valueField="code"
          value={currentLanguage}
          dropdownPosition="top"
          onChange={(item) => {
            switchLanguage(item.code as SupportedLanguage);
          }}
          renderItem={(item) => (
            <View className="flex-row items-center px-3 py-2.5">
              <Text className="mr-2 text-xl">{item.flag}</Text>
              <Text className="text-sm font-semibold text-[#492800]">
                {item.code.toUpperCase()}
              </Text>
            </View>
          )}
          selectedTextStyle={{
            fontSize: 20,
            textAlign: "center",
            width: "100%",
          }}
          placeholder=""
          activeColor="#F5E6D3"
          iconStyle={{ display: "none" }}
        />
      </Animated.View>
    </View>
  );
};
