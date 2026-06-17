import { View, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import { router } from 'expo-router';
import type { HuaweiMapProps } from '@/types/mapTypes';
import { useLanguage } from '@/hooks/useLanguage';

export default function HuaweiMap({
  geocodedLocations,
  isLoading,
}: HuaweiMapProps) {
  const { t } = useLanguage();

  // JavaScript to inject restaurant locations into the WebView
  const injectLocations = `
    window.RESTAURANT_LOCATIONS = ${JSON.stringify(geocodedLocations)};
    if (window.updateMapLocations) {
      window.updateMapLocations(window.RESTAURANT_LOCATIONS);
    }
  `;

  if (isLoading) {
    return (
      <View className='flex-1 justify-center items-center'>
        <Text className='text-lg font-medium'>
          {t('locations.loadingRestaurantLocations')}
        </Text>
      </View>
    );
  }

  return (
    <WebView
      source={require('@/assets/html/huawei-map.html')}
      style={{ flex: 1 }}
      javaScriptEnabled={true}
      domStorageEnabled={true}
      startInLoadingState={true}
      scalesPageToFit={true}
      mixedContentMode='compatibility'
      injectedJavaScript={injectLocations}
      onMessage={(event) => {
        const message = event.nativeEvent.data;
        console.log('WebView message:', message);

        try {
          const data = JSON.parse(message);
          if (data.type === 'markerClick' && data.locationId) {
            router.push(`/location/${data.locationId}`);
          }
        } catch (error) {
          console.log('Non-JSON message received:', message);
        }
      }}
      onError={(syntheticEvent) => {
        const { nativeEvent } = syntheticEvent;
        console.warn('WebView error: ', nativeEvent);
      }}
      onLoad={() => {
        console.log('OpenStreetMap loaded successfully');
      }}
    />
  );
}
