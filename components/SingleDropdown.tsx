import { View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { useState } from "react";
import { DropdownData } from "@/types/dropdown";

interface SingleDropdownProps {
  data: DropdownData[];
  placeholder: string;
  searchPlaceholder: string;
  leftIcon: React.ReactNode;
  rightIcon: React.ReactNode;
  width?: string;
  value?: string; // For controlled component
  onValueChange?: (value: string) => void; // For controlled component
}

const SingleDropdown = ({
  data,
  placeholder,
  searchPlaceholder,
  leftIcon,
  rightIcon,
  width,
  value: controlledValue,
  onValueChange,
}: SingleDropdownProps) => {
  const [internalSelected, setInternalSelected] = useState<string>("");

  // Use controlled value if provided, otherwise use internal state
  const selected =
    controlledValue !== undefined ? controlledValue : internalSelected;

  const handleChange = (item: { label: string; value: string }) => {
    if (controlledValue !== undefined && onValueChange) {
      // Controlled component
      onValueChange(item.value);
    } else {
      // Uncontrolled component
      setInternalSelected(item.value);
    }
  };

  return (
    <View
      className={`border border-gray-100 rounded-[10px] mt-3 ${width} min-h-10 justify-center px-2`}
    >
      <Dropdown
        data={data}
        labelField="label"
        valueField="value"
        placeholder={placeholder}
        searchPlaceholder={searchPlaceholder}
        placeholderStyle={{
          color: "#492800B2",
          paddingLeft: 10,
          fontSize: 14,
          fontFamily: "poppins-regular",
          paddingTop: 3,
        }}
        search
        value={selected}
        onChange={handleChange}
        renderLeftIcon={() => (
          <View className="mr-2 self-center">{leftIcon}</View>
        )}
        renderRightIcon={() => (
          <View className="ml-2 self-center">{rightIcon}</View>
        )}
        itemTextStyle={{
          color: "#492800",
          fontSize: 14,
          fontFamily: "poppins-regular",
        }}
        selectedTextStyle={{
          color: "#492800",
          fontSize: 14,
          fontFamily: "poppins-regular",
          paddingLeft: leftIcon ? 0 : 10,
          paddingTop: 3,
        }}
        inputSearchStyle={{
          borderColor: "#D38B5D36",
          borderRadius: 10,
          color: "#492800",
          fontSize: 14,
          fontFamily: "poppins-regular",
        }}
        containerStyle={{
          borderColor: "#D38B5D36",
          borderRadius: 10,
          marginTop: 5,
        }}
        itemContainerStyle={{
          borderBottomColor: "#D38B5D1A",
        }}
        activeColor="#D38B5D1A"
        autoScroll={false}
        flatListProps={{
          keyboardShouldPersistTaps: "handled",
        }}
      />
    </View>
  );
};

export default SingleDropdown;
