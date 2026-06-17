// import { Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";
import { useAuthStore } from "@/zustand/authStore";
import LoginPrompt from "@/components/profile/LoginPrompt";
import { router } from "expo-router";
import ProfileView from "@/components/profile/ProfileView";
import { FloatingLanguageSelector } from "@/components/shared/LanguageSwitcher";

export default function Profile() {
  const { logoutUser, isLoading } = useAuthStore();
  const user = useAuthStore((state) => state.user);

  const handleLogout = async () => {
    try {
      const result = await logoutUser();
      // console.log("Logout result:", result);
    } catch (error: any) {
      // console.log("Error logging out:", error.statusCode);
    }
  };

  return (
    <SafeAreaView
      className="flex-1 px-5 bg-white"
      edges={["top", "left", "right"]}
    >
      {user ? (
        <ProfileView
          username={user.name}
          userId={user.id}
          onLogout={handleLogout}
          isLoggingOut={isLoading}
        />
      ) : (
        <LoginPrompt
          onLogin={() => {
            router.push("/login");
          }}
          onCreateAccount={() => {
            router.push("/register");
          }}
        />
      )}
      <FloatingLanguageSelector />
    </SafeAreaView>
  );
}
