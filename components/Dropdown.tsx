import { View, TextInput } from 'react-native';
import { MultiSelect } from 'react-native-element-dropdown';
import { useState } from 'react';
import { DropdownProps } from '@/types/dropdown';
import { useLanguage } from '@/hooks/useLanguage';

const Dropdown = ({
  data,
  placeholder,
  searchPlaceholder,
  leftIcon,
  rightIcon,
  width,
  selectedPlaceholder,
  value: controlledValue,
  onValueChange,
}: DropdownProps) => {
  const [internalSelected, setInternalSelected] = useState<string[]>([]);

  // Use controlled value if provided, otherwise use internal state
  const selected =
    controlledValue !== undefined ? controlledValue : internalSelected;

  const handleChange = (item: string[]) => {
    if (controlledValue !== undefined && onValueChange) {
      // Controlled component
      onValueChange(item);
    } else {
      // Uncontrolled component
      setInternalSelected(item);
    }
  };

  return (
    <View
      className={`border border-[#D38B5D36] rounded-[10px] mt-3 ${width} min-h-10 justify-center px-2`}
    >
      <MultiSelect
        data={data}
        labelField='label'
        valueField='value'
        placeholder={selected.length > 0 ? selectedPlaceholder : placeholder}
        searchPlaceholder={searchPlaceholder}
        placeholderStyle={{
          color: '#492800B2',
          paddingLeft: selected.length > 0 ? 0 : 10,
          fontSize: 14,
          fontFamily: 'poppins-regular',
          paddingTop: 3,
        }}
        search
        onChange={handleChange}
        value={selected}
        renderLeftIcon={() => (selected.length > 0 ? null : <>{leftIcon}</>)}
        renderRightIcon={() => <>{rightIcon}</>}
        selectedStyle={{
          backgroundColor: '#D38B5D36',
          borderRadius: 8,
          borderWidth: 1,
          borderColor: '#D38B5D36',
          marginVertical: 2,
          marginHorizontal: 2,
          paddingHorizontal: 8,
          paddingVertical: 4,
        }}
        selectedTextStyle={{
          color: '#492800B2',
          fontFamily: 'poppins-regular',
          fontSize: 12,
        }}
        containerStyle={{
          borderRadius: 10,
          borderColor: '#D38B5D36',
        }}
        itemTextStyle={{
          color: '#492800B2',
          fontFamily: 'poppins-regular',
        }}
        // For the search input
        inputSearchStyle={{
          color: '#492800B2',
          fontFamily: 'poppins-regular',
          borderRadius: 10,
          borderColor: '#D38B5D36',
        }}
        // searchPlaceholderTextColor="#492800B2"
        activeColor='#D38B5D36'
        renderInputSearch={(onSearch) => {
          const { t } = useLanguage();
          return (
            <TextInput
              placeholder={t('locations.searchLocation')}
              placeholderTextColor='#492800B2'
              style={{
                color: '#492800B2',
                fontFamily: 'poppins-regular',
                fontSize: 14,
                paddingHorizontal: 10,
                paddingBottom: 6,
                paddingTop: 10,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: '#D38B5D36',
                backgroundColor: '#FFFFFF',
              }}
              onChangeText={onSearch}
            />
          );
        }}
      />
    </View>
  );
};

export default Dropdown;
