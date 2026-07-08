import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  Linking,
} from "react-native";
import { useState, useRef } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useAuthStore } from "@/zustand/authStore";
import {
  Edit,
  FileText,
  Headphones,
  ChevronRight,
  DoorOpen,
  Trash2,
} from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import FormInput from "@/components/auth/FormInput";
import { useLanguage } from "@/hooks/useLanguage";

// Validation schema - will be created dynamically with translations
const createProfileSchema = (t: any) =>
  z.object({
    name: z.string().min(2, t("profile.nameMinLength")),
    email: z.string().email(t("profile.invalidEmail")),
  });

type ProfileFormData = {
  name: string;
  email: string;
};

interface AccountDetailsProps {
  userId?: string;
}

export default function AccountDetails({ userId }: AccountDetailsProps = {}) {
  const { id: urlId } = useLocalSearchParams<{ id: string }>();
  const id = userId || urlId;
  const router = useRouter();
  const { t } = useLanguage();
  const user = useAuthStore((state) => state.user);
  const {
    updateProfile,
    isLoadingProfile,
    updateProfileError,
    setUpdateProfileError,
    deleteAccount,
    isLoadingDeleteAccount,
    deleteAccountError,
    logoutUser,
  } = useAuthStore();

  // Editing states
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);

  // Refs for inputs
  const nameInputRef = useRef<TextInput>(null);
  const emailInputRef = useRef<TextInput>(null);

  // Form setup
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(createProfileSchema(t)),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
    },
  });

  // Handle profile data submission
  const onSubmitName = async (data: ProfileFormData) => {
    try {
      await updateProfile({ name: data.name });
      setIsEditingName(false);
    } catch (error) {
      console.log("Error updating name:", error);
    }
  };

  const onSubmitEmail = async (data: ProfileFormData) => {
    try {
      await updateProfile({ email: data.email });
      setIsEditingEmail(false);
    } catch (error) {
      console.log("Error updating email:", error);
    }
  };

  // Handle "Schimba" button press
  const handleEditName = () => {
    if (isEditingName) {
      // Save changes
      handleSubmit(onSubmitName)();
    } else {
      // Start editing
      setUpdateProfileError(null); // Clear any previous errors
      setValue("name", user?.name || "");
      setIsEditingName(true);

      // Focus the input after state update
      setTimeout(() => {
        nameInputRef.current?.focus();
      }, 100);
    }
  };

  const handleEditEmail = () => {
    if (isEditingEmail) {
      // Save changes
      handleSubmit(onSubmitEmail)();
    } else {
      // Start editing
      setUpdateProfileError(null); // Clear any previous errors
      setValue("email", user?.email || "");
      setIsEditingEmail(true);

      // Focus the input after state update
      setTimeout(() => {
        emailInputRef.current?.focus();
      }, 100);
    }
  };

  // Cancel editing
  const cancelEdit = (field: "name" | "email") => {
    setUpdateProfileError(null); // Clear any errors
    if (field === "name") {
      setValue("name", user?.name || "");
      setIsEditingName(false);
    } else {
      setValue("email", user?.email || "");
      setIsEditingEmail(false);
    }
  };

  const handleChangePhoto = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (result.canceled) return;

      const asset: ImagePicker.ImagePickerAsset = result.assets?.[0];
      if (!asset?.uri) return;

      const file = {
        uri: asset.uri,
        name: asset.fileName ?? "",
        type: asset.mimeType ?? "",
      };

      await updateProfile({ picture: file });
    } catch (e) {
      console.log(e);
    }
  };

  // Handle menu actions
  const handleTermsPress = () => {
    Linking.openURL("https://csie.ase.ro/contact/");
  };

  const handleSupportPress = () => {
    Linking.openURL("tel:0730319951");
  };

  const handleLogout = async () => {
    Alert.alert(
      t("profile.logoutConfirmTitle"),
      t("profile.logoutConfirmMessage"),
      [
        {
          text: t("common.cancel"),
          style: "cancel",
        },
        {
          text: t("profile.logOut"),
          style: "destructive",
          onPress: async () => {
            try {
              await logoutUser();
              router.replace("/");
            } catch (error: any) {
              console.log("Error logging out:", error);
            }
          },
        },
      ]
    );
  };

  const handleDeleteAccount = async () => {
    Alert.alert(
      t("profile.deleteAccountTitle"),
      t("profile.deleteAccountMessage"),
      [
        {
          text: t("common.cancel"),
          style: "cancel",
        },
        {
          text: t("profile.deleteAccount"),
          style: "destructive",
          onPress: () => {
            // Double confirmation
            Alert.alert(
              t("profile.finalConfirmation"),
              t("profile.finalConfirmationMessage"),
              [
                {
                  text: t("common.cancel"),
                  style: "cancel",
                },
                {
                  text: t("profile.deletePermanently"),
                  style: "destructive",
                  onPress: async () => {
                    try {
                      await deleteAccount();
                      router.replace("/");
                    } catch (error: any) {
                      console.log("Error deleting account:", error);
                      Alert.alert(
                        t("reservations.error"),
                        t("profile.couldNotDeleteAccount")
                      );
                    }
                  },
                },
              ]
            );
          },
        },
      ]
    );
  };

  // Redirect if user is not authenticated or trying to access another user's profile
  if (!user || user.id !== id) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="mb-4 font-['poppins-medium'] text-lg text-[#492800]">
          {t("profile.noAccessToProfile")}
        </Text>
        <TouchableOpacity
          onPress={() => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.push("/");
            }
          }}
          className="rounded-full bg-[#D38B5D] px-6 py-3"
        >
          <Text className="font-['poppins-medium'] text-base text-white">
            {t("common.back")}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <>
      {/* Header */}
      <View className="relative items-center justify-center py-4">
        {/* Back Button - Absolute Left */}
        {/* <TouchableOpacity
          onPress={() => router.back()}
          className="absolute left-0 bg-[rgba(73,40,0,0.05)] rounded-[30px] p-2 z-10"
        >
          <ArrowLeft size={20} color="#492800" />
        </TouchableOpacity> */}

        {/* Title - Absolute Centered */}
        <Text className="font-['poppins-medium'] text-lg text-[#492800]">
          {t("profile.accountDetails")}
        </Text>
      </View>

      {/* Profile Avatar */}
      <View className="items-center pb-12 pt-6">
        <View className="relative">
          <View className="h-[145px] w-[145px] overflow-hidden rounded-full bg-[#D9D9D9]">
            {user.imageUrl ? (
              <Image
                source={{
                  uri:
                    (process.env.EXPO_PUBLIC_API_BASE_URL ?? "") +
                    user.imageUrl,
                }}
                className="h-full w-full"
                resizeMode="cover"
              />
            ) : (
              <View className="h-full w-full items-center justify-center bg-[#D9D9D9]">
                <Text className="font-['poppins-bold'] text-4xl text-[#999]">
                  {user.name.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
          </View>

          {/* Edit Icon */}
          <TouchableOpacity
            className="absolute bottom-0 right-0 rounded-full bg-white p-1"
            onPress={handleChangePhoto}
          >
            <Edit size={22} color="#492800" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Form Fields */}
      <View>
        {/* Username Field */}
        <View className={`${!isEditingName ? "mb-6" : ""}`}>
          <View className="mb-2 flex-row items-center justify-between">
            <Text className="ml-4 font-['poppins-medium'] text-xs text-[#492800]">
              {!isEditingName ? t("profile.username") : ""}
            </Text>
            <View className="flex-row gap-2">
              {isEditingName && (
                <TouchableOpacity onPress={() => cancelEdit("name")}>
                  <Text className="font-['poppins-medium'] text-xs text-[#E50101]">
                    {t("common.cancel")}
                  </Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                onPress={handleEditName}
                disabled={isLoadingProfile}
              >
                <Text
                  className={`font-['poppins-medium'] text-xs ${
                    isLoadingProfile ? "text-gray-400" : "text-[#005E84]"
                  }`}
                >
                  {isEditingName
                    ? isLoadingProfile
                      ? t("profile.saving")
                      : t("common.save")
                    : t("profile.change")}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          {isEditingName ? (
            <FormInput
              name="name"
              control={control}
              label=""
              placeholder={t("profile.enterName")}
              error={errors.name}
              className="rounded-[14px] border border-[#E4E4E4] bg-white px-4 py-3 font-['poppins-medium'] text-sm text-[#492800]"
              inputRef={nameInputRef}
              clearErrorOnChange={(onChange) => (value) => {
                setUpdateProfileError(null);
                onChange(value);
              }}
            />
          ) : (
            <View className="rounded-[14px] border border-[#E4E4E4] bg-white px-4 py-3">
              <Text className="font-['poppins-medium'] text-sm text-[#492800]">
                {user.name}
              </Text>
            </View>
          )}
        </View>

        {/* Phone Field */}
        <View className="mb-6">
          <View className="mb-2 flex-row items-center justify-between">
            <Text className="ml-4 font-['poppins-medium'] text-xs text-[#492800]">
              {t("profile.phoneNumber")}
            </Text>
            {/* <TouchableOpacity>
              <Text className="font-['poppins-medium'] text-xs text-[#005E84]">
                Schimba
              </Text>
            </TouchableOpacity> */}
          </View>
          <View className="rounded-[14px] border border-[#E4E4E4] bg-white px-4 py-3">
            <View className="flex-row">
              <Text className="font-['poppins-medium'] text-sm text-[#492800]">
                {user.phone}
              </Text>
            </View>
          </View>
        </View>

        {/* Email Field */}
        <View className="mb-6">
          <View className="mb-2 flex-row items-center justify-between">
            <Text className="ml-4 font-['poppins-medium'] text-xs text-[#492800]">
              {t("profile.email")}
            </Text>
            <View className="flex-row gap-2">
              {isEditingEmail && (
                <TouchableOpacity onPress={() => cancelEdit("email")}>
                  <Text className="font-['poppins-medium'] text-xs text-[#E50101]">
                    {t("common.cancel")}
                  </Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                onPress={handleEditEmail}
                disabled={isLoadingProfile}
              >
                <Text
                  className={`font-['poppins-medium'] text-xs ${
                    isLoadingProfile ? "text-gray-400" : "text-[#005E84]"
                  }`}
                >
                  {isEditingEmail
                    ? isLoadingProfile
                      ? t("profile.saving")
                      : t("common.save")
                    : t("profile.change")}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          {isEditingEmail ? (
            <FormInput
              name="email"
              control={control}
              label=""
              placeholder={t("profile.enterEmail")}
              error={errors.email}
              className="rounded-[14px] border border-[#E4E4E4] bg-white px-4 py-3 font-['poppins-medium'] text-sm text-[#492800]"
              keyboardType="email-address"
              autoCapitalize="none"
              inputRef={emailInputRef}
              clearErrorOnChange={(onChange) => (value) => {
                setUpdateProfileError(null);
                onChange(value);
              }}
            />
          ) : (
            <View className="rounded-[14px] border border-[#E4E4E4] bg-white px-4 py-3">
              <Text className="font-['poppins-medium'] text-sm text-[#492800]">
                {user.email}
              </Text>
            </View>
          )}
          {updateProfileError && (isEditingName || isEditingEmail) && (
            <Text className="ml-4 mt-2 font-['poppins-medium'] text-xs text-[#E50101]">
              {updateProfileError}
            </Text>
          )}
        </View>

        {/* Menu Options */}
        <View className="mt-8">
          <View className="p-y rounded-[16px] bg-white">
            {/* Termeni și Condiții */}
            <TouchableOpacity
              onPress={handleTermsPress}
              className="flex-row items-center justify-between py-4"
            >
              <View className="flex-1 flex-row items-center">
                <FileText size={22} color="#492800" strokeWidth={2} />
                <Text className="ml-4 font-['poppins-medium'] text-base text-[#492800]">
                  {t("profile.terms")}
                </Text>
              </View>
              <ChevronRight size={18} color="#434343" strokeWidth={1.5} />
            </TouchableOpacity>

            {/* Separator */}
            <View className="h-px w-full bg-gray-200" />

            {/* Customer Support */}
            <TouchableOpacity
              onPress={handleSupportPress}
              className="flex-row items-center justify-between py-4"
            >
              <View className="flex-1 flex-row items-center">
                <Headphones size={22} color="#492800" strokeWidth={2} />
                <Text className="ml-4 font-['poppins-medium'] text-base text-[#492800]">
                  {t("profile.customerSupport")}
                </Text>
              </View>
              <ChevronRight size={18} color="#434343" strokeWidth={1.5} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Action Buttons */}
        <View className="mt-8 space-y-3">
          {/* Logout Button */}
          <TouchableOpacity
            onPress={handleLogout}
            className="flex-row items-center rounded-[16px] bg-white py-4"
          >
            <DoorOpen size={22} color="#D38B5D" strokeWidth={2} />
            <Text className="ml-4 font-['poppins-medium'] text-base text-[#D38B5D]">
              {t("profile.logOut")}
            </Text>
          </TouchableOpacity>

          {/* Delete Account Button */}
          <TouchableOpacity
            onPress={handleDeleteAccount}
            disabled={isLoadingDeleteAccount}
            className={`flex-row items-center rounded-[16px] bg-white py-4 ${
              isLoadingDeleteAccount ? "opacity-50" : ""
            }`}
          >
            <Trash2 size={22} color="#E53E3E" strokeWidth={2} />
            <Text className="ml-4 font-['poppins-medium'] text-base text-[#E53E3E]">
              {isLoadingDeleteAccount
                ? t("profile.deletingAccount")
                : t("profile.deleteAccount")}
            </Text>
          </TouchableOpacity>

          {/* Delete Account Error */}
          {deleteAccountError && (
            <Text className="ml-4 mt-2 font-['poppins-medium'] text-xs text-[#E50101]">
              {deleteAccountError}
            </Text>
          )}
        </View>
      </View>
    </>
  );
}
