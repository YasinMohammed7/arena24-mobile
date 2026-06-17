import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { useLanguage } from '@/hooks/useLanguage';

interface EventTimerProps {
  eventDate: Date;
}

export default function EventTimer({ eventDate }: EventTimerProps) {
  const { t } = useLanguage();
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const eventTime = new Date(eventDate).getTime();
      const difference = eventTime - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60)
        );

        setTimeLeft({ days, hours, minutes });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0 });
      }
    };

    // Calculate immediately
    calculateTimeLeft();

    // Update every minute
    const timer = setInterval(calculateTimeLeft, 60000);

    return () => clearInterval(timer);
  }, [eventDate]);

  // Don't show timer if event has passed
  if (timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0) {
    return null;
  }

  return (
    <View className='bg-[#FFA91A14] rounded-[14px] px-0 py-2.5 items-center w-full'>
      <Text className="font-['Poppins'] font-light text-xs text-[rgba(73,40,0,0.7)] mb-2">
        {t('homepage.timeRemaining')}
      </Text>
      <Text className="font-['Poppins'] font-normal text-2xl text-[#EF7816] text-center">
        {timeLeft.days} {t('homepage.days')} : {timeLeft.hours}{' '}
        {t('homepage.hours')} : {timeLeft.minutes} {t('homepage.minutes')}
      </Text>
    </View>
  );
}
