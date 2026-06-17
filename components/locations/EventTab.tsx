import { LocationDetail, LocationEvent } from '@/types/locations';
import { SafeAreaView } from 'react-native-safe-area-context';
import CardEvent from '@/components/homepage/CardEvent';
import { FlatList, View, Text } from 'react-native';
import { useLanguage } from '@/hooks/useLanguage';

export default function EventTab({
  location,
}: {
  location: LocationDetail | null;
}) {
  const { t } = useLanguage();
  if (!location?.events || location.events.length === 0) {
    return (
      <SafeAreaView
        className='flex-1 bg-white'
        edges={['top', 'left', 'right']}
      >
        <View className='flex-1 justify-center items-center px-4'>
          <Text className="text-lg font-['poppins-medium'] text-[#492800] text-center">
            {t('locations.noEventsAvailable')}
          </Text>
          <Text className="text-sm font-['poppins-light'] text-[rgba(73,40,0,0.7)] text-center mt-2">
            {t('locations.checkBackLater')}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className='flex-1 bg-white pt-4' edges={['left', 'right']}>
      <FlatList
        data={location.events}
        keyExtractor={(item: LocationEvent) => item.id.toString()}
        renderItem={({ item }) => (
          <CardEvent event={item} overrideLocation={location} />
        )}
        showsVerticalScrollIndicator={false}
        scrollEnabled={true}
      />
    </SafeAreaView>
  );
}
