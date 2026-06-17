import { Platform, Linking, Alert } from 'react-native';
import PermissionLayout from './PermissionLayout';
import { useLanguage } from '@/hooks/useLanguage';

export default function PermissionDeniedPermanently() {
  const { t } = useLanguage();

  const openDeviceSettings = () => {
    Alert.alert(
      t('permissions.openSettingsTitle'),
      t('permissions.openSettingsMessage'),
      [
        {
          text: t('common.cancel'),
          style: 'cancel',
        },
        {
          text: t('permissions.openSettings'),
          onPress: () => {
            if (Platform.OS === 'ios') {
              Linking.openURL('app-settings:');
            } else {
              Linking.openSettings();
            }
          },
        },
      ]
    );
  };

  return (
    <PermissionLayout
      title={t('permissions.locationRequired')}
      description={t('permissions.locationDeniedPermanently')}
      buttonText={t('permissions.openSettings')}
      onButtonPress={openDeviceSettings}
    />
  );
}
