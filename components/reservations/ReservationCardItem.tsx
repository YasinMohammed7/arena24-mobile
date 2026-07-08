import { View, Text } from "react-native";
import {
  CheckCircle,
  Calendar,
  Clock,
  Users,
  CircleX,
} from "lucide-react-native";
import { ReservationCardItemProps } from "@/types/reservations";
import { useLanguage } from "@/hooks/useLanguage";

export default function ReservationCardItem({
  location,
  type,
  title,
  status,
  date,
  time,
  people,
  note,
}: ReservationCardItemProps) {
  const { t } = useLanguage();

  const getStatusIcon = () => {
    switch (status) {
      case "CONFIRMED":
        return <CheckCircle size={22} color="#2E7800" />;
      case "PENDING":
        return <Clock size={22} color="#F59E0B" />;
      case "CANCELLED":
        return <CircleX size={22} color="#DC2626" />;
      case "FINISHED":
        return <CheckCircle size={22} color="#464646" />;
      default:
        return <CheckCircle size={22} color="#2E7800" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "CONFIRMED":
        return t("reservations.confirmed");
      case "PENDING":
        return t("reservations.pending");
      case "CANCELLED":
        return t("reservations.cancelled");
      case "FINISHED":
        return t("reservations.finished");
      default:
        return t("reservations.confirmed");
    }
  };

  const getStatusBadgeColor = () => {
    switch (status) {
      case "CONFIRMED":
        return "bg-green-100";
      case "PENDING":
        return "bg-yellow-100";
      case "CANCELLED":
        return "bg-red-100";
      case "FINISHED":
        return "bg-[#ECECEC]";
      default:
        return "bg-green-100";
    }
  };

  const getStatusTextColor = () => {
    switch (status) {
      case "CONFIRMED":
        return "text-green-700";
      case "PENDING":
        return "text-yellow-700";
      case "CANCELLED":
        return "text-red-700";
      case "FINISHED":
        return "text-[#464646]";
      default:
        return "text-green-700";
    }
  };

  return (
    <View className="rounded-2xl border border-[#e0e0e0] bg-white p-4">
      {/* Header Section */}
      <View className="flex flex-col gap-3.5">
        <View className="flex flex-row items-center justify-between">
          <View className="flex flex-row gap-4">
            {/* Status Icon */}
            <View>{getStatusIcon()}</View>

            {/* Restaurant Info */}
            <View className="flex flex-col">
              <Text className="font-['hotel-resort'] text-[#492800]">
                {location}
              </Text>
              <Text className="text-xs font-medium text-[#492800B2] opacity-70">
                {title}
              </Text>
            </View>
          </View>

          {/* Status Badge */}
          <View
            className={`${getStatusBadgeColor()} rounded-xl px-3 py-1 text-center`}
          >
            <Text className={`${getStatusTextColor()} text-xs font-medium`}>
              {getStatusText()}
            </Text>
          </View>
        </View>

        {/* Details Section */}
        <View className="flex flex-col gap-2">
          {/* Date */}
          <View className="flex flex-row items-center gap-2">
            <View className="flex items-center justify-center">
              <Calendar size={16} color="#99621E" strokeWidth={1.5} />
            </View>
            <Text className="font-['poppins-light'] text-sm text-[#492800B2]">
              {date}
            </Text>
          </View>

          {/* Time */}
          <View className="flex flex-row items-center gap-2">
            <View className="flex items-center justify-center">
              <Clock size={16} color="#99621E" strokeWidth={1.5} />
            </View>
            <Text className="font-['poppins-light'] text-sm text-[#492800B2]">
              {time}
            </Text>
          </View>

          {/* People */}
          <View className="flex flex-row items-center gap-2">
            <View className="flex items-center justify-center">
              <Users size={16} color="#99621E" strokeWidth={1.5} />
            </View>
            <Text className="font-['poppins-light'] text-sm text-[#492800B2]">
              {people}{" "}
              {people === 1
                ? t("reservations.person")
                : t("reservations.people")}
            </Text>
          </View>
        </View>

        {/* Note Section */}
        {note && (
          <View className="flex justify-center rounded-lg bg-gray-100 p-3">
            <Text className="font-['poppins-regular'] text-sm text-[#232323]">
              {note}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}
