import { View, Text } from "react-native";
import { useForm, useWatch } from "react-hook-form";
import FormInput from "@/components/auth/FormInput";
import { useAuthStore } from "@/zustand/authStore";
import { useEffect } from "react";
import { useDetailsReservationStore } from "@/zustand/detailsReservationStore";
import { useLanguage } from "@/hooks/useLanguage";

interface DetailsFormData {
  name: string;
  phone: string;
  specialRequirements: string;
}

export default function DetailsStep() {
  const { t } = useLanguage();
  const { user } = useAuthStore();
  const setDetails = useDetailsReservationStore((state) => state.setDetails);

  const { control } = useForm<DetailsFormData>({
    defaultValues: {
      name: user?.name || "",
      phone: user?.phone || "",
      specialRequirements: "",
    },
  });

  const specialReq = useWatch({ name: "specialRequirements", control });
  useEffect(() => {
    setDetails({
      name: user?.name || "",
      phone: user?.phone || "",
      specialRequirements: specialReq || "",
    });
  }, [specialReq, user, setDetails]);

  return (
    <View className="flex-1">
      {/* Readonly Name Field */}
      <View className="mb-6">
        <Text className="mb-2 font-['poppins-medium'] text-sm text-[#000000]">
          {t("reservations.yourName")}
        </Text>
        <View className="rounded-[11px] border border-[#EBEBEB] bg-[#F8F8F8] px-3 py-3">
          <Text className="font-['poppins-medium'] text-sm text-[#666666]">
            {user?.name || ""}
          </Text>
        </View>
      </View>

      {/* Readonly Phone Field */}
      <View className="mb-6">
        <Text className="mb-2 font-['poppins-medium'] text-sm text-[#000000]">
          {t("reservations.contactPhone")}
        </Text>
        <View className="rounded-[11px] border border-[#EBEBEB] bg-[#F8F8F8] px-3 py-3">
          <Text className="font-['poppins-medium'] text-sm text-[#666666]">
            {user?.phone || ""}
          </Text>
        </View>
      </View>

      <FormInput
        name="specialRequirements"
        control={control}
        label={t("reservations.specialRequirements")}
        placeholder={t("reservations.otherRequirementsInfo")}
        multiline={true}
        numberOfLines={6}
        className="h-[126px] w-full rounded-[14px] border border-[#E4E4E4] bg-white px-4 py-3 font-['poppins-medium'] text-sm text-[#000]"
        textAlignVertical="top"
      />
    </View>
  );
}
