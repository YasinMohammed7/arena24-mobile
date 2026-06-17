import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
} from 'react-native';
import { useState, useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuthStore } from '@/zustand/authStore';
import {
  ArrowLeft,
  Edit,
  FileText,
  Headphones,
  ChevronRight,
  DoorOpen,
  Trash2,
} from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import FormInput from '@/components/auth/FormInput';
import Button from '@/components/shared/Button';
import { useLanguage } from '@/hooks/useLanguage';

// Validation schema - will be created dynamically with translations
const createProfileSchema = (t: any) =>
  z.object({
    name: z.string().min(2, t('profile.nameMinLength')),
    email: z.string().email(t('profile.invalidEmail')),
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
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(createProfileSchema(t)),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
    },
  });

  // Handle profile data submission
  const onSubmitName = async (data: ProfileFormData) => {
    try {
      await updateProfile({ name: data.name });
      setIsEditingName(false);
    } catch (error) {
      console.log('Error updating name:', error);
    }
  };

  const onSubmitEmail = async (data: ProfileFormData) => {
    try {
      await updateProfile({ email: data.email });
      setIsEditingEmail(false);
    } catch (error) {
      console.log('Error updating email:', error);
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
      setValue('name', user?.name || '');
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
      setValue('email', user?.email || '');
      setIsEditingEmail(true);

      // Focus the input after state update
      setTimeout(() => {
        emailInputRef.current?.focus();
      }, 100);
    }
  };

  // Cancel editing
  const cancelEdit = (field: 'name' | 'email') => {
    setUpdateProfileError(null); // Clear any errors
    if (field === 'name') {
      setValue('name', user?.name || '');
      setIsEditingName(false);
    } else {
      setValue('email', user?.email || '');
      setIsEditingEmail(false);
    }
  };

  const handleChangePhoto = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (result.canceled) return;

      const asset: ImagePicker.ImagePickerAsset = result.assets?.[0];
      if (!asset?.uri) return;

      const file = {
        uri: asset.uri,
        name: asset.fileName ?? '',
        type: asset.mimeType ?? '',
      };

      await updateProfile({ picture: file });
    } catch (e) {
      console.log(e);
    }
  };

  // Handle menu actions
  const handleTermsPress = () => {
    // TODO: Create terms and conditions page
    console.log('Terms and conditions pressed');
  };

  const handleSupportPress = () => {
    // TODO: Create customer support page
    console.log('Customer support pressed');
  };

  const handleLogout = async () => {
    Alert.alert(
      t('profile.logoutConfirmTitle'),
      t('profile.logoutConfirmMessage'),
      [
        {
          text: t('common.cancel'),
          style: 'cancel',
        },
        {
          text: t('profile.logOut'),
          style: 'destructive',
          onPress: async () => {
            try {
              await logoutUser();
              router.replace('/');
            } catch (error: any) {
              console.log('Error logging out:', error);
            }
          },
        },
      ]
    );
  };

  const handleDeleteAccount = async () => {
    Alert.alert(
      t('profile.deleteAccountTitle'),
      t('profile.deleteAccountMessage'),
      [
        {
          text: t('common.cancel'),
          style: 'cancel',
        },
        {
          text: t('profile.deleteAccount'),
          style: 'destructive',
          onPress: () => {
            // Double confirmation
            Alert.alert(
              t('profile.finalConfirmation'),
              t('profile.finalConfirmationMessage'),
              [
                {
                  text: t('common.cancel'),
                  style: 'cancel',
                },
                {
                  text: t('profile.deletePermanently'),
                  style: 'destructive',
                  onPress: async () => {
                    try {
                      await deleteAccount();
                      router.replace('/');
                    } catch (error: any) {
                      console.log('Error deleting account:', error);
                      Alert.alert(
                        t('reservations.error'),
                        t('profile.couldNotDeleteAccount')
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
      <View className='flex-1 justify-center items-center'>
        <Text className="text-lg font-['poppins-medium'] text-[#492800] mb-4">
          {t('profile.noAccessToProfile')}
        </Text>
        <TouchableOpacity
          onPress={() => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.push('/');
            }
          }}
          className='bg-[#D38B5D] rounded-full px-6 py-3'
        >
          <Text className="text-white font-['poppins-medium'] text-base">
            {t('common.back')}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <>
      {/* Header */}
      <View className='relative justify-center items-center py-4'>
        {/* Back Button - Absolute Left */}
        {/* <TouchableOpacity
          onPress={() => router.back()}
          className="absolute left-0 bg-[rgba(73,40,0,0.05)] rounded-[30px] p-2 z-10"
        >
          <ArrowLeft size={20} color="#492800" />
        </TouchableOpacity> */}

        {/* Title - Absolute Centered */}
        <Text className="font-['poppins-medium'] text-lg text-[#492800]">
          {t('profile.accountDetails')}
        </Text>
      </View>

      {/* Profile Avatar */}
      <View className='items-center pt-6 pb-12'>
        <View className='relative'>
          <View className='w-[145px] h-[145px] rounded-full bg-[#D9D9D9] overflow-hidden'>
            {user.imageUrl ? (
              <Image
                source={{
                  uri:
                    (process.env.EXPO_PUBLIC_API_BASE_URL ?? '') +
                    user.imageUrl,
                }}
                className='w-full h-full'
                resizeMode='cover'
              />
            ) : (
              <View className='w-full h-full bg-[#D9D9D9] items-center justify-center'>
                <Text className="font-['poppins-bold'] text-4xl text-[#999]">
                  {user.name.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
          </View>

          {/* Edit Icon */}
          <TouchableOpacity
            className='absolute bottom-0 right-0 bg-white rounded-full p-1'
            onPress={handleChangePhoto}
          >
            <Edit size={22} color='#492800' />
          </TouchableOpacity>
        </View>
      </View>

      {/* Form Fields */}
      <View>
        {/* Username Field */}
        <View className={`${!isEditingName ? 'mb-6' : ''}`}>
          <View className='flex-row justify-between items-center mb-2'>
            <Text className="font-['poppins-medium'] text-xs text-[#492800] ml-4">
              {!isEditingName ? t('profile.username') : ''}
            </Text>
            <View className='flex-row gap-2'>
              {isEditingName && (
                <TouchableOpacity onPress={() => cancelEdit('name')}>
                  <Text className="font-['poppins-medium'] text-xs text-[#E50101]">
                    {t('common.cancel')}
                  </Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                onPress={handleEditName}
                disabled={isLoadingProfile}
              >
                <Text
                  className={`font-['poppins-medium'] text-xs ${
                    isLoadingProfile ? 'text-gray-400' : 'text-[#005E84]'
                  }`}
                >
                  {isEditingName
                    ? isLoadingProfile
                      ? t('profile.saving')
                      : t('common.save')
                    : t('profile.change')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          {isEditingName ? (
            <FormInput
              name='name'
              control={control}
              label=''
              placeholder={t('profile.enterName')}
              error={errors.name}
              className="bg-white border border-[#E4E4E4] rounded-[14px] px-4 py-3 font-['poppins-medium'] text-sm text-[#492800]"
              inputRef={nameInputRef}
              clearErrorOnChange={(onChange) => (value) => {
                setUpdateProfileError(null);
                onChange(value);
              }}
            />
          ) : (
            <View className='bg-white border border-[#E4E4E4] rounded-[14px] px-4 py-3'>
              <Text className="font-['poppins-medium'] text-sm text-[#492800]">
                {user.name}
              </Text>
            </View>
          )}
        </View>

        {/* Phone Field */}
        <View className='mb-6'>
          <View className='flex-row justify-between items-center mb-2'>
            <Text className="font-['poppins-medium'] text-xs text-[#492800] ml-4">
              {t('profile.phoneNumber')}
            </Text>
            {/* <TouchableOpacity>
              <Text className="font-['poppins-medium'] text-xs text-[#005E84]">
                Schimba
              </Text>
            </TouchableOpacity> */}
          </View>
          <View className='bg-white border border-[#E4E4E4] rounded-[14px] px-4 py-3'>
            <View className='flex-row'>
              <Text className="font-['poppins-medium'] text-sm text-[#492800]">
                {user.phone}
              </Text>
            </View>
          </View>
        </View>

        {/* Email Field */}
        <View className='mb-6'>
          <View className='flex-row justify-between items-center mb-2'>
            <Text className="font-['poppins-medium'] text-xs text-[#492800] ml-4">
              {t('profile.email')}
            </Text>
            <View className='flex-row gap-2'>
              {isEditingEmail && (
                <TouchableOpacity onPress={() => cancelEdit('email')}>
                  <Text className="font-['poppins-medium'] text-xs text-[#E50101]">
                    {t('common.cancel')}
                  </Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                onPress={handleEditEmail}
                disabled={isLoadingProfile}
              >
                <Text
                  className={`font-['poppins-medium'] text-xs ${
                    isLoadingProfile ? 'text-gray-400' : 'text-[#005E84]'
                  }`}
                >
                  {isEditingEmail
                    ? isLoadingProfile
                      ? t('profile.saving')
                      : t('common.save')
                    : t('profile.change')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          {isEditingEmail ? (
            <FormInput
              name='email'
              control={control}
              label=''
              placeholder={t('profile.enterEmail')}
              error={errors.email}
              className="bg-white border border-[#E4E4E4] rounded-[14px] px-4 py-3 font-['poppins-medium'] text-sm text-[#492800]"
              keyboardType='email-address'
              autoCapitalize='none'
              inputRef={emailInputRef}
              clearErrorOnChange={(onChange) => (value) => {
                setUpdateProfileError(null);
                onChange(value);
              }}
            />
          ) : (
            <View className='bg-white border border-[#E4E4E4] rounded-[14px] px-4 py-3'>
              <Text className="font-['poppins-medium'] text-sm text-[#492800]">
                {user.email}
              </Text>
            </View>
          )}
          {updateProfileError && (isEditingName || isEditingEmail) && (
            <Text className="font-['poppins-medium'] text-xs text-[#E50101] mt-2 ml-4">
              {updateProfileError}
            </Text>
          )}
        </View>

        {/* Menu Options */}
        <View className='mt-8'>
          <View className='bg-white rounded-[16px] p-y'>
            {/* Termeni și Condiții */}
            <TouchableOpacity
              onPress={handleTermsPress}
              className='flex-row justify-between items-center py-4'
            >
              <View className='flex-row items-center flex-1'>
                <FileText size={22} color='#492800' strokeWidth={2} />
                <Text className="font-['poppins-medium'] text-base text-[#492800] ml-4">
                  {t('profile.terms')}
                </Text>
              </View>
              <ChevronRight size={18} color='#434343' strokeWidth={1.5} />
            </TouchableOpacity>

            {/* Separator */}
            <View className='w-full h-px bg-gray-200' />

            {/* Customer Support */}
            <TouchableOpacity
              onPress={handleSupportPress}
              className='flex-row justify-between items-center py-4'
            >
              <View className='flex-row items-center flex-1'>
                <Headphones size={22} color='#492800' strokeWidth={2} />
                <Text className="font-['poppins-medium'] text-base text-[#492800] ml-4">
                  {t('profile.customerSupport')}
                </Text>
              </View>
              <ChevronRight size={18} color='#434343' strokeWidth={1.5} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Action Buttons */}
        <View className='mt-8 space-y-3'>
          {/* Logout Button */}
          <TouchableOpacity
            onPress={handleLogout}
            className='bg-white rounded-[16px] py-4 flex-row items-center'
          >
            <DoorOpen size={22} color='#D38B5D' strokeWidth={2} />
            <Text className="font-['poppins-medium'] text-base text-[#D38B5D] ml-4">
              {t('profile.logOut')}
            </Text>
          </TouchableOpacity>

          {/* Delete Account Button */}
          <TouchableOpacity
            onPress={handleDeleteAccount}
            disabled={isLoadingDeleteAccount}
            className={`bg-white rounded-[16px] py-4 flex-row items-center ${
              isLoadingDeleteAccount ? 'opacity-50' : ''
            }`}
          >
            <Trash2 size={22} color='#E53E3E' strokeWidth={2} />
            <Text className="font-['poppins-medium'] text-base text-[#E53E3E] ml-4">
              {isLoadingDeleteAccount
                ? t('profile.deletingAccount')
                : t('profile.deleteAccount')}
            </Text>
          </TouchableOpacity>

          {/* Delete Account Error */}
          {deleteAccountError && (
            <Text className="font-['poppins-medium'] text-xs text-[#E50101] mt-2 ml-4">
              {deleteAccountError}
            </Text>
          )}
        </View>
      </View>
    </>
  );
}
