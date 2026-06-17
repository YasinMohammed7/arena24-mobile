import { View, Text, ScrollView } from 'react-native';
import React from 'react';
import SingleDropdown from '../SingleDropdown';
import YesNoSelector from './YesNoSelector';
import { ChevronDown } from 'lucide-react-native';
import { DropdownData } from '@/types/dropdown';
import { useEventReservationStore } from '@/zustand/eventReservationStore';
import { useLanguage } from '@/hooks/useLanguage';

export default function EventsStep() {
  const { t } = useLanguage();
  // Form state management from store
  const {
    selectedEventType,
    selectedBudget,
    needsStaff,
    needsDJ,
    needsValetParking,
    needsSecurity,
    needsHostess,
    needsWardrobe,
    setEventType,
    setBudget,
    setNeedsStaff,
    setNeedsDJ,
    setNeedsValetParking,
    setNeedsSecurity,
    setNeedsHostess,
    setNeedsWardrobe,
  } = useEventReservationStore();

  // Dropdown data
  const eventTypesData: DropdownData[] = [
    { label: t('reservations.nameFirst'), value: 'onomastica' },
    { label: t('reservations.birthday'), value: 'zi-de-nastere' },
    { label: t('reservations.wedding'), value: 'nunta' },
    { label: t('reservations.baptism'), value: 'botez' },
    { label: t('reservations.corporate'), value: 'corporate' },
    { label: t('reservations.other'), value: 'altele' },
  ];

  const budgetData: DropdownData[] = [
    { label: t('reservations.lowBudget'), value: 'scazut' },
    { label: t('reservations.mediumBudget'), value: 'mediu' },
    { label: t('reservations.highBudget'), value: 'ridicat' },
  ];

  return (
    <ScrollView className='flex-1' showsVerticalScrollIndicator={false}>
      <View>
        {/* Main Question */}
        <Text className="font-['poppins-medium'] text-sm text-[#492800]">
          {t('reservations.eventTypeQuestion')}
        </Text>
        {/* Event Type Dropdown */}
        <View className='mb-6'>
          <SingleDropdown
            data={eventTypesData}
            placeholder={t('reservations.eventType')}
            searchPlaceholder={t('reservations.searchEventType')}
            leftIcon={null}
            rightIcon={<ChevronDown size={16} color='rgba(73, 40, 0, 0.7)' />}
            width='w-full'
            value={selectedEventType}
            onValueChange={setEventType}
          />
        </View>
        {/* Budget Question */}
        <Text className="font-['poppins-medium'] text-sm text-[#492800]">
          {t('reservations.availableBudget')}
        </Text>
        {/* Budget Dropdown */}
        <View className='mb-6'>
          <SingleDropdown
            data={budgetData}
            placeholder={t('reservations.selectBudget')}
            searchPlaceholder={t('reservations.searchBudget')}
            leftIcon={null}
            rightIcon={<ChevronDown size={16} color='rgba(73, 40, 0, 0.7)' />}
            width='w-full'
            value={selectedBudget}
            onValueChange={setBudget}
          />
        </View>
        {/* Yes/No Questions */}
        <YesNoSelector
          question={t('reservations.hireStaffQuestion')}
          value={needsStaff}
          onChange={setNeedsStaff}
        />
        <YesNoSelector
          question={t('reservations.djQuestion')}
          value={needsDJ}
          onChange={setNeedsDJ}
        />
        <YesNoSelector
          question={t('reservations.valetParkingQuestion')}
          value={needsValetParking}
          onChange={setNeedsValetParking}
        />
        <YesNoSelector
          question={t('reservations.securityQuestion')}
          value={needsSecurity}
          onChange={setNeedsSecurity}
        />
        <YesNoSelector
          question={t('reservations.hostessQuestion')}
          value={needsHostess}
          onChange={setNeedsHostess}
        />
        <YesNoSelector
          question={t('reservations.wardrobeQuestion')}
          value={needsWardrobe}
          onChange={setNeedsWardrobe}
        />
      </View>
    </ScrollView>
  );
}
