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
      await logoutUser();
    } catch (error: any) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <SafeAreaView
      className="flex-1 bg-white px-5"
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
