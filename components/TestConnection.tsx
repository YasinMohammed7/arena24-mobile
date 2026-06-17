import { View, Text, TouchableOpacity } from 'react-native';
import { useAuthStore } from '@/zustand/authStore';
import { useLanguage } from '@/hooks/useLanguage';

const TestConnection = () => {
  const { t } = useLanguage();
  const isConnected = useAuthStore((state) => state.isConnected);
  const isLoading = useAuthStore((state) => state.isLoading);
  const connectionError = useAuthStore((state) => state.connectionError);
  const testConnection = useAuthStore((state) => state.testConnection);

  const handleTest = () => {
    testConnection();
  };

  return (
    <View className='px-4 py-6 bg-white'>
      <View className='border border-blue-200 rounded-lg p-4 bg-blue-50'>
        <Text className="font-['poppins-semibold'] text-lg text-blue-700 mb-2">
          {t('testConnection.title')}
        </Text>

        <TouchableOpacity
          onPress={handleTest}
          disabled={isLoading}
          className={`py-3 px-4 rounded-lg mb-3 ${
            isLoading ? 'bg-gray-300' : 'bg-blue-500'
          }`}
          activeOpacity={0.8}
        >
          <Text className="font-['poppins-medium'] text-white text-center text-sm">
            {isLoading
              ? t('testConnection.testing')
              : t('testConnection.testConnection')}
          </Text>
        </TouchableOpacity>

        {/* Status indicator */}
        <View className='flex-row items-center mb-2'>
          <View
            className={`w-3 h-3 rounded-full mr-2 ${
              isConnected ? 'bg-green-500' : 'bg-red-500'
            }`}
          />
          <Text
            className={`font-['poppins-regular'] text-sm ${
              isConnected ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {isConnected
              ? t('testConnection.connected')
              : t('testConnection.disconnected')}
          </Text>
        </View>

        {/* Error display */}
        {connectionError && (
          <Text className="font-['poppins-regular'] text-red-500 text-xs mt-2">
            {connectionError}
          </Text>
        )}
      </View>
    </View>
  );
};

export default TestConnection;
