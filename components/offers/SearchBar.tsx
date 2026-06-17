import { View, TouchableOpacity, TextInput } from 'react-native';
import SearchIcon from '@/assets/offers-icons/search-icon.svg';
import FilterIcon from '@/assets/offers-icons/filter-icon.svg';
import { Input, InputField, InputIcon, InputSlot } from '@/components/ui/input';
import { useLanguage } from '@/hooks/useLanguage';

interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  onFilterPress?: () => void;
  showFilter?: boolean;
}

export default function SearchBar({
  placeholder,
  value,
  onChangeText,
  onFilterPress,
  showFilter = true,
}: SearchBarProps) {
  const { t } = useLanguage();
  const defaultPlaceholder = placeholder || t('offers.searchPlaceholder');
  return (
    <View className='w-full bg-gray-100 border border-gray-200 rounded-full mt-5'>
      {/* Search Section */}
      <View className='flex flex-row items-center justify-between w-full'>
        <View className='flex-row items-center gap-2 flex-1'>
          {/* Search Input with Icon */}
          <Input
            variant='rounded'
            size='md'
            className='flex-1 bg-transparent border-0'
          >
            <InputSlot className='ml-3'>
              <InputIcon as={SearchIcon} />
            </InputSlot>
            <InputField
              placeholder={defaultPlaceholder}
              placeholderTextColor='#49280073'
              className="font-['poppins-light'] text-[#49280073] text-sm text-left -mb-1"
              value={value}
              onChangeText={onChangeText}
            />
          </Input>
        </View>

        {/* Filter Section */}
        {showFilter && (
          <View className='flex-row items-center'>
            {/* Vertical Line Separator */}
            <View className='w-0 h-6 border-r border-gray-200' />

            {/* Filter Icon */}
            <TouchableOpacity className='px-3' onPress={onFilterPress}>
              <FilterIcon />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}
