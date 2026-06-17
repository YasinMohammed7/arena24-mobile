import { useState } from 'react';
import { View, Text, Switch, TouchableOpacity } from 'react-native';
import {
  MessageSquareMore,
  Mail,
  FileText,
  Headphones,
  ChevronRight,
  LogOut,
} from 'lucide-react-native';
import { ProfileMenuProps } from '../../types/profile';
import Button from '../shared/Button';
import { useLanguage } from '@/hooks/useLanguage';

export default function ProfileMenu({
  onTermsPress,
  onSupportPress,
  onLogout,
  isLoggingOut = false,
}: ProfileMenuProps) {
  const { t } = useLanguage();
  // const [smsNotifications, setSmsNotifications] = useState(true);
  // const [emailNotifications, setEmailNotifications] = useState(true);

  const menuItems = [
    // {
    //   id: "sms",
    //   icon: MessageSquareMore,
    //   title: "Notificari prin SMS",
    //   type: "toggle" as const,
    //   value: smsNotifications,
    //   onToggle: setSmsNotifications,
    // },
    // {
    //   id: "email",
    //   icon: Mail,
    //   title: "Notificari prin e-mail",
    //   type: "toggle" as const,
    //   value: emailNotifications,
    //   onToggle: setEmailNotifications,
    // },
    {
      id: 'terms',
      icon: FileText,
      title: t('profile.terms'),
      type: 'navigation' as const,
      onPress: onTermsPress,
    },
    {
      id: 'support',
      icon: Headphones,
      title: t('profile.customerSupport'),
      type: 'navigation' as const,
      onPress: onSupportPress,
    },
  ];

  return (
    <View className='w-full mb-5'>
      {menuItems.map((item, index) => (
        <View key={item.id}>
          <View className='flex-row justify-between items-center w-full py-4'>
            {/* Left side - Icon and title */}
            <View className='flex-row items-center flex-1'>
              <item.icon size={22} color='#492800' strokeWidth={2} />
              <Text className="font-['DM Sans'] font-light text-base text-black ml-4">
                {item.title}
              </Text>
            </View>

            {/* Right side - Toggle or Arrow */}
            {/* {item.type === "toggle" ? (
              <Switch
                value={item.value}
                onValueChange={item.onToggle}
                trackColor={{ false: "#EAEAEA", true: "#54A224" }}
                thumbColor="#FFFFFF"
                ios_backgroundColor="#EAEAEA"
              />
            ) : ( */}
            <TouchableOpacity onPress={item.onPress}>
              <ChevronRight size={18} color='#434343' strokeWidth={1.5} />
            </TouchableOpacity>
            {/* )} */}
          </View>

          {/* Separator line */}
          {index < menuItems.length - 1 && (
            <View className='w-full h-px bg-gray-200' />
          )}
        </View>
      ))}

      {/* Logout Button */}
      <View className='mt-12 w-full flex justify-center items-center'>
        <Button
          onPress={onLogout}
          disabled={isLoggingOut}
          className={`bg-red-500 rounded-2xl py-3 px-5 ${
            isLoggingOut ? 'opacity-50' : ''
          }`}
          text={isLoggingOut ? t('profile.loggingOut') : t('profile.logOut')}
          textStyle="text-white font-['DM Sans'] text-base font-medium"
        />
      </View>
    </View>
  );
}
