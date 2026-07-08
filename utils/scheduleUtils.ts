import { Schedule } from "@/types/locations";
import i18n from "@/i18n/config";

// Convert JS getDay() (0=Sunday ... 6=Saturday) to API format (1=Monday ... 7=Sunday)
const jsDayToApiDay = (jsDay: number): number => {
  return jsDay === 0 ? 7 : jsDay;
};

// Function to check if restaurant is currently open and get schedule
export const checkScheduleAndOpenStatus = (
  schedule: Schedule[]
): {
  isCurrentlyOpen: boolean;
  currentSchedule: string;
} => {
  const now = new Date();
  const currentApiDay = jsDayToApiDay(now.getDay());
  const currentTime = now.getHours() * 60 + now.getMinutes(); // Convert to minutes

  // Find schedule for today's dayOfWeek (API format: 1=Monday ... 7=Sunday)
  const todaySchedule = schedule.find(
    (scheduleItem) => scheduleItem.dayOfWeek === currentApiDay
  );

  if (todaySchedule) {
    // Set current schedule display
    const currentSchedule = `${todaySchedule.startTime} - ${todaySchedule.endTime}`;

    // Check if currently open
    const startTime = todaySchedule.startTime.split(":");
    const endTime = todaySchedule.endTime.split(":");
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
      currentSchedule: i18n.t("homepage.closed"),
    };
  }
};
