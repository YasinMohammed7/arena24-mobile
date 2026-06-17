import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView } from 'expo-camera';
import { View, Text, Alert } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { useRef } from 'react';
import { useLanguage } from '@/hooks/useLanguage';

export default function QrScanner() {
  const { t } = useLanguage();
  const { locationId } = useLocalSearchParams<{
    locationId: string;
  }>();
  const isScanned = useRef(false);

  const handleBarcodeScanned = (result: any) => {
    if (isScanned.current) return; // Previne scanările multiple

    isScanned.current = true;
    const data = JSON.parse(result.data);
    console.log(data.locationId, locationId);
    if (data.locationId === locationId) {
      router.push(
        `/location/${data.locationId}?tableNumber=${data.tableNumber}`
      );
    } else {
      Alert.alert(
        t('qrScanner.wrongLocation'),
        t('qrScanner.wrongLocationMessage')
      );
      router.back() ?? router.replace('/');
    }

    // setTimeout(() => { isScanned.current = false; }, 3000);
  };

  return (
    <SafeAreaView
      className='flex-1 bg-white px-3'
      edges={['top', 'left', 'right']}
    >
      {/* Header */}
      <View className='relative justify-center items-center py-4'>
        {/* Back Button - Absolute Left */}
        <TouchableOpacity
          onPress={() => router.back() ?? router.replace('/')}
          className='absolute left-0 bg-[#49280008] rounded-[30px] p-2 flex-row items-center z-10'
          style={{ backgroundColor: 'rgba(73, 40, 0, 0.05)' }}
        >
          <ArrowLeft size={20} color='#492800' strokeWidth={2} />
        </TouchableOpacity>

        {/* Location Name - Centered */}
        <Text className="text-lg font-['hotel-resort'] text-[#492800] text-center">
          {t('qrScanner.tableNumber')}
        </Text>
      </View>
      <View className='flex-1 rounded-2xl overflow-hidden mb-10'>
        <CameraView
          style={{ flex: 1 }}
          barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
          onBarcodeScanned={handleBarcodeScanned}
        />
      </View>
    </SafeAreaView>
  );
}
