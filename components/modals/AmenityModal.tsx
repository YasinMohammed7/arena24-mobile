import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
} from 'react-native';
import type { AmenityModalProps } from '@/types/modal';
import { useLanguage } from '@/hooks/useLanguage';

export default function AmenityModal({
  visible,
  onClose,
  onConfirm,
  loading = false,
  text,
}: AmenityModalProps) {
  const { t } = useLanguage();

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType='fade'
      onRequestClose={onClose}
    >
      {/* Background overlay */}
      <View className='flex-1 bg-black/50 justify-end'>
        {/* Modal content */}
        <View className='bg-white rounded-t-[34px] border border-[#E4E4E4] border-b-0'>
          <View className='px-16 py-12'>
            {/* Title */}
            <Text className="text-black font-['poppins-medium'] text-lg text-center mb-8">
              {text}
            </Text>

            {/* Buttons */}
            <View className='flex-row justify-center items-center gap-6'>
              {/* NO Button */}
              <TouchableOpacity
                onPress={onClose}
                disabled={loading}
                className={`border border-[#ECECEC] rounded-xl px-16 py-4 bg-white ${
                  loading ? 'opacity-50' : ''
                }`}
              >
                <Text className="text-black font-['poppins-medium'] text-base text-center">
                  {t('common.no')}
                </Text>
              </TouchableOpacity>

              {/* YES Button */}
              <TouchableOpacity
                onPress={onConfirm}
                disabled={loading}
                className={`rounded-xl px-16 py-4 flex-row items-center justify-center ${
                  loading
                    ? 'bg-gray-300 border border-gray-400'
                    : 'bg-[#F6FCF2] border border-[#CAD8BE]'
                }`}
              >
                {loading ? (
                  <>
                    <ActivityIndicator
                      size='small'
                      color='#666'
                      className='mr-2'
                    />
                    <Text className="text-gray-600 font-['poppins-medium'] text-base text-center">
                      {t('common.sending')}
                    </Text>
                  </>
                ) : (
                  <Text className="text-[#2A5108] font-['poppins-medium'] text-base text-center">
                    {t('common.yes')}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}
