import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MIcon from '@/assets/auth-icons/m-icon.svg';
// import GoogleIcon from "@/assets/auth-icons/google-icon.svg";
import { useSegments, Slot } from 'expo-router';
import TabBarDuo from '@/components/shared/TabBarDuo';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { useLanguage } from '@/hooks/useLanguage';

const AuthLayout = () => {
  const { t } = useLanguage();
  const segments = useSegments();
  const currentRoute = segments[segments.length - 1] as string;

  // Show TabBarAuth only for login and register routes
  const showTabBarAuth =
    currentRoute === 'login' || currentRoute === 'register';

  return (
    <SafeAreaView className='flex-1 bg-white'>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        bottomOffset={50}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View className='px-5'>
          {/* Top Image */}
          <View className='items-center my-10'>
            <MIcon width={78} height={78} />
          </View>

          {/* Main Content Card */}
          <View
            className={`bg-white rounded-3xl border border-gray-200 px-5 py-5 ${
              currentRoute === 'completeRegistration' ? 'mb-10' : ''
            }`}
          >
            {showTabBarAuth && (
              <TabBarDuo
                principalRoute='login'
                secondaryRoute='register'
                principalText={t('auth.login')}
                secondaryText={t('auth.createAccount')}
                principalTitle={t('authLayout.pleaseAuthenticate')}
                secondaryTitle={t('auth.createAccount')}
                textColor='#99621E'
                routePrefix='/(auth)'
                activeTab={currentRoute}
              />
            )}

            {/* Content Area - Always render Slot */}
            <Slot />
          </View>

          {/* Google Button - only show for login/register - future version */}
          {/* {showTabBarAuth && (
            <>
              <Text className="font-['DM Sans'] text-s font-light text-black text-center my-6">
                sau
              </Text>
              <TouchableOpacity className="flex-row items-center justify-center bg-white border border-gray-200 rounded-[42px] py-3 gap-2">
                <GoogleIcon width={20} height={20} />
                <Text className="font-['DM Sans'] text-sm font-medium text-[#3C4043] tracking-[0.25px]">
                  Sign in with Google
                </Text>
              </TouchableOpacity>
            </>
          )} */}
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default AuthLayout;
