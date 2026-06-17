import { View, Text, TouchableOpacity } from 'react-native';
import { FlatList } from 'react-native';
import { useEffect } from 'react';
import BreakfastIcon from '@/assets/offers-icons/breakfast-icon.svg';
import { offersCategory } from '@/types/offers';
import { useOffersStore } from '@/zustand/offersStore';
import { useLanguage } from '@/hooks/useLanguage';

const OffersCategory = () => {
  const { t } = useLanguage();
  const offersCategories = useOffersStore((state) => state.offersCategories);
  const isLoadingCategories = useOffersStore(
    (state) => state.isLoadingCategories
  );
  const errorCategories = useOffersStore((state) => state.errorCategories);
  const fetchOffersCategories = useOffersStore(
    (state) => state.fetchOffersCategories
  );

  useEffect(() => {
    fetchOffersCategories();
  }, []);

  const renderCategoryItem = ({ item }: { item: offersCategory }) => (
    <TouchableOpacity className='flex items-center gap-2'>
      {/* Icon Container */}
      <View className='w-16 h-16 bg-[#F4F4F4] rounded-xl flex items-center justify-center shadow-sm'>
        <BreakfastIcon />
      </View>

      {/* Label */}
      <Text className='text-xs font-medium text-black text-center'>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  if (isLoadingCategories) {
    return (
      <View className='mt-6 border-b border-[#F1F1F1] pb-6'>
        <Text className='text-center text-sm text-gray-500'>
          {t('offers.loadingCategories')}
        </Text>
      </View>
    );
  }

  if (errorCategories) {
    return (
      <View className='mt-6 border-b border-[#F1F1F1] pb-6'>
        <Text className='text-center text-sm text-red-500'>
          {errorCategories}
        </Text>
      </View>
    );
  }

  return (
    <View className='mt-6 border-b border-[#F1F1F1] pb-6'>
      <FlatList
        data={offersCategories}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderCategoryItem}
        contentContainerStyle={{
          gap: 20,
        }}
      />
    </View>
  );
};

export default OffersCategory;
