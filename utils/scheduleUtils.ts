import { Schedule } from '@/types/locations';
import i18n from '@/i18n/config';

// Function to get current day using i18n
export const getCurrentDay = (): string => {
  const days = [
    i18n.t('weekdays.sunday'),
    i18n.t('weekdays.monday'),
    i18n.t('weekdays.tuesday'),
    i18n.t('weekdays.wednesday'),
    i18n.t('weekdays.thursday'),
    i18n.t('weekdays.friday'),
    i18n.t('weekdays.saturday'),
  ];
  return days[new Date().getDay()];
};

// Function to check if restaurant is currently open and get schedule
export const checkScheduleAndOpenStatus = (
  schedule: Schedule[]
): {
  isCurrentlyOpen: boolean;
  currentSchedule: string;
} => {
  const now = new Date();
  const currentDayIndex = new Date().getDay();
  const currentTime = now.getHours() * 60 + now.getMinutes(); // Convert to minutes

  // Get day names in all supported languages
  const dayNamesInAllLanguages = {
    0: ['Sunday', 'Duminică', 'Sonntag'], // Sunday
    1: ['Monday', 'Luni', 'Montag'], // Monday
    2: ['Tuesday', 'Marți', 'Dienstag'], // Tuesday
    3: ['Wednesday', 'Miercuri', 'Mittwoch'], // Wednesday
    4: ['Thursday', 'Joi', 'Donnerstag'], // Thursday
    5: ['Friday', 'Vineri', 'Freitag'], // Friday
    6: ['Saturday', 'Sâmbătă', 'Sambata', 'Samstag'], // Saturday
  };

  // Range names in all languages
  const weekdayRanges = [
    'Monday - Friday',
    'Luni - Vineri',
    'Montag - Freitag',
  ];
  const weekendRanges = [
    'Saturday - Sunday',
    'Sambata - Duminica',
    'Sâmbătă - Duminică',
    'Samstag - Sonntag',
    'Weekend',
    'Wochenende',
  ];

  // Find schedule for current day with better weekend handling
  let todaySchedule = schedule.find((scheduleItem) => {
    const dayOfWeek = scheduleItem.dayOfWeek;

    // Direct day match - check if any translation of current day is in the schedule
    const currentDayNames = dayNamesInAllLanguages[currentDayIndex];
    if (currentDayNames.some((name) => dayOfWeek.includes(name))) {
      return true;
    }

    // Weekday range handling (Monday - Friday)
    const isWeekday = currentDayIndex >= 1 && currentDayIndex <= 5;
    if (
      isWeekday &&
      weekdayRanges.some((range) => dayOfWeek.includes(range))
    ) {
      return true;
    }

    // Weekend range handling (Saturday - Sunday)
    const isWeekend = currentDayIndex === 0 || currentDayIndex === 6;
    if (
      isWeekend &&
      weekendRanges.some((range) => dayOfWeek.includes(range))
    ) {
      return true;
    }

    return false;
  });

  if (todaySchedule) {
    // Set current schedule display
    const currentSchedule = `${todaySchedule.startTime} - ${todaySchedule.endTime}`;

    // Check if currently open
    const startTime = todaySchedule.startTime.split(':');
    const endTime = todaySchedule.endTime.split(':');
    const startMinutes = parseInt(startTime[0]) * 60 + parseInt(startTime[1]);
    const endMinutes = parseInt(endTime[0]) * 60 + parseInt(endTime[1]);

    // Handle cases where closing time is the next day (e.g., 08:00 - 02:00)
    const isOpen =
      endMinutes < startMinutes
        ? currentTime >= startMinutes || currentTime <= endMinutes // Spans midnight
        : currentTime >= startMinutes && currentTime <= endMinutes; // Same day

    return {
      isCurrentlyOpen: isOpen,
      currentSchedule,
    };
  } else {
    return {
      isCurrentlyOpen: false,
      currentSchedule: i18n.t('homepage.closed'),
    };
  }
};
