import TabBarDuo from '@/components/shared/TabBarDuo';
import { Slot, useSegments } from 'expo-router';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLanguage } from '@/hooks/useLanguage';

const LocationsLayout = () => {
  const segments = useSegments();
  const currentRoute = segments[segments.length - 1] || 'locationsList';
  const { t } = useLanguage();

  return (
    <SafeAreaView
      className='flex-1 bg-white px-5'
      edges={['top', 'left', 'right']}
    >
      <View>
        <TabBarDuo
          principalRoute='locationsList'
          secondaryRoute='locationsMap'
          principalText={t('locations.listView')}
          secondaryText={t('locations.mapView')}
          textColor='#99621E'
          routePrefix='/(navigationBar)/(locations)'
          activeTab={currentRoute}
        />
      </View>
      <View className='flex-1'>
        <Slot />
      </View>
    </SafeAreaView>
  );
};

export default LocationsLayout;
