import { View, ScrollView } from "react-native";
import ProfileMenu from "./ProfileMenu";
import { ProfileViewProps } from "../../types/profile";
import AccountDetails from "./AccountDetails";

export default function ProfileView({
  username,
  userId,
  onLogout,
  isLoggingOut,
}: ProfileViewProps) {
  const handleTermsPress = () => {
    // Navigate to terms and conditions
    console.log("Terms and conditions pressed");
  };

  const handleSupportPress = () => {
    // Navigate to customer support
    console.log("Customer support pressed");
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
      <AccountDetails userId={userId} />
      {/* <View className="mt-2">
        <ProfileMenu
          onTermsPress={handleTermsPress}
          onSupportPress={handleSupportPress}
          onLogout={onLogout}
          isLoggingOut={isLoggingOut}
        />
      </View> */}
    </ScrollView>
  );
}
