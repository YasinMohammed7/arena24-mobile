import PermissionLayout from './PermissionLayout';
import type { PermissionDeniedProps } from '@/types/permissions';
import { useLanguage } from '@/hooks/useLanguage';

export default function PermissionDenied({
  onRequestPermission,
  isCheckingPermission,
}: PermissionDeniedProps) {
  const { t } = useLanguage();

  return (
    <PermissionLayout
      title={t('permissions.locationRequired')}
      description={t('permissions.locationDescription')}
      buttonText={t('permissions.grantLocationAccess')}
      onButtonPress={onRequestPermission}
      isLoading={isCheckingPermission}
    />
  );
}
