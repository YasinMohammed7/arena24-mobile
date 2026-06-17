import { View, Text } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import FormInput from '@/components/auth/FormInput';
import { useAuthStore } from '@/zustand/authStore';
import { useEffect } from 'react';
import { useDetailsReservationStore } from '@/zustand/detailsReservationStore';
import { useLanguage } from '@/hooks/useLanguage';

interface DetailsFormData {
  name: string;
  phone: string;
  specialRequirements: string;
}

export default function DetailsStep() {
  const { t } = useLanguage();
  const { user } = useAuthStore();
  const setDetails = useDetailsReservationStore((state) => state.setDetails);
  const setSpecialRequirements = useDetailsReservationStore(
    (state) => state.setSpecialRequirements
  );

  const { control, watch } = useForm<DetailsFormData>({
    defaultValues: {
      name: user?.name || '',
      phone: user?.phone || '',
      specialRequirements: '',
    },
  });

  const specialReq = watch('specialRequirements');
  useEffect(() => {
    setDetails({
      name: user?.name || '',
      phone: user?.phone || '',
      specialRequirements: specialReq || '',
    });
  }, [specialReq, user]);

  return (
    <View className='flex-1'>
      {/* Readonly Name Field */}
      <View className='mb-6'>
        <Text className="font-['poppins-medium'] text-sm text-[#000000] mb-2">
          {t('reservations.yourName')}
        </Text>
        <View className='border border-[#EBEBEB] rounded-[11px] px-3 py-3 bg-[#F8F8F8]'>
          <Text className="font-['poppins-medium'] text-sm text-[#666666]">
            {user?.name || ''}
          </Text>
        </View>
      </View>

      {/* Readonly Phone Field */}
      <View className='mb-6'>
        <Text className="font-['poppins-medium'] text-sm text-[#000000] mb-2">
          {t('reservations.contactPhone')}
        </Text>
        <View className='border border-[#EBEBEB] rounded-[11px] px-3 py-3 bg-[#F8F8F8]'>
          <Text className="font-['poppins-medium'] text-sm text-[#666666]">
            {user?.phone || ''}
          </Text>
        </View>
      </View>

      <FormInput
        name='specialRequirements'
        control={control}
        label={t('reservations.specialRequirements')}
        placeholder={t('reservations.otherRequirementsInfo')}
        multiline={true}
        numberOfLines={6}
        className="w-full h-[126px] bg-white border border-[#E4E4E4] rounded-[14px] px-4 py-3 font-['poppins-medium'] text-sm text-[#000]"
        textAlignVertical='top'
      />
    </View>
  );
}
