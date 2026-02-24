// Global imports
import { LinearGradient } from "expo-linear-gradient";
import { Alert, Pressable, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

// Local imports
import { Rn, Text } from "@/components/ui";
import UserSection from "@/components/User/user-section";
import { Icon } from "@/components/ui";
import { useColorScheme } from "@/lib/useColorScheme";
import { useAuthStore } from "@/store";
import Avatar from "@/components/ui-components/Avatar";

const User = () => {
  const { user, clearAuth } = useAuthStore();
  const { isDarkColorScheme, toggleColorScheme } = useColorScheme();

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => clearAuth(),
      },
    ]);
  };

  const accountSettings = [
    {
      title: "Edit Profile",
      subTitle: "Update your personal information",
      icon: "User",
      onPress: () => router.push("/user/edit-profile"),
    },
    {
      title: "Phone Number",
      subTitle: user?.phone || "Not provided",
      icon: "Phone",
    },
    {
      title: "Email Address",
      subTitle: user?.email || "Not provided",
      icon: "Mail",
    },
  ];

  const managementSettings = [
    {
      title: "Categories",
      subTitle: "Manage your expense categories",
      icon: "FolderOpen",
      onPress: () => router.push("/user/categories"),
    },
  ];

  const preferences = [
    {
      title: "Appearance",
      subTitle: isDarkColorScheme ? "Dark Mode" : "Light Mode",
      icon: isDarkColorScheme ? "Moon" : "Sun",
      onPress: toggleColorScheme,
    },
    {
      title: "Notifications",
      subTitle: "Manage notification settings",
      icon: "Bell",
    },
    {
      title: "Security",
      subTitle: "Password and authentication",
      icon: "Lock",
    },
  ];

  const supports = [
    {
      title: "Help & Support",
      subTitle: "Get help with the app",
      icon: "Info",
      onPress: () => router.push("/user/help-support"),
    },
    {
      title: "Privacy Policy",
      subTitle: "Read our privacy policy",
      icon: "FileText",
      onPress: () => router.push("/user/privacy-policy"),
    },
    {
      title: "About",
      subTitle: "Version 1.0.0",
      icon: "Info",
    },
  ];
  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-background">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Profile Header with Vercel Gradient */}
        <View className="px-5 pt-6 pb-8">
          <Rn.Card className="p-4 rounded-2xl overflow-hidden">
            <View className="flex-row items-center gap-4">
              {/* Avatar */}
              <Avatar
                fallback={user?.name?.slice(0, 2).toUpperCase()}
                size={64}
              />

              {/* User Info */}
              <View>
                <Text
                  style={{ color: isDarkColorScheme ? "#ffffff" : "#18181b" }}
                  className="text-2xl font-bold mb-1 capitalize"
                >
                  {user?.name || "User"}
                </Text>
                <Text
                  style={{ color: isDarkColorScheme ? "#a1a1aa" : "#52525b" }}
                  className="text-sm mb-4"
                >
                  {user?.phone}
                </Text>

                {/* Stats Row */}
                <View className="flex-row gap-4">
                  <View
                    style={{
                      backgroundColor: isDarkColorScheme
                        ? "rgba(63, 63, 70, 0.5)"
                        : "rgba(228, 228, 231, 0.8)",
                      borderWidth: 1,
                      borderColor: isDarkColorScheme
                        ? "rgba(82, 82, 91, 0.3)"
                        : "rgba(212, 212, 216, 0.8)",
                    }}
                    className="px-4 py-1 rounded-full"
                  >
                    <Text
                      style={{
                        color: isDarkColorScheme ? "#e4e4e7" : "#3f3f46",
                      }}
                      className="text-xs font-semibold"
                    >
                      {user?.role || "USER"}
                    </Text>
                  </View>
                  {user?.phoneVerified && (
                    <View
                      style={{
                        backgroundColor: "rgba(20, 184, 166, 0.15)",
                        borderWidth: 1,
                        borderColor: "rgba(20, 184, 166, 0.3)",
                      }}
                      className="px-4 py-1 rounded-full flex-row items-center gap-2"
                    >
                      <Icon name="CircleCheck" size={14} color="#14B8A6" />
                      <Text className="text-primary text-xs font-semibold">
                        Verified
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
          </Rn.Card>
        </View>

        {/* Account Settings Section */}
        <UserSection title="Account" cards={accountSettings} />

        {/* Management Section */}
        <UserSection title="Management" cards={managementSettings} />

        {/* Preferences Section */}
        <UserSection title="Preferences" cards={preferences} />

        {/* Support Section */}
        <UserSection title="Support" cards={supports} />

        {/* Logout Button */}
        <Pressable onPress={handleLogout} className="px-5 mt-4 mb-24">
          <View className="bg-destructive/10 rounded-2xl p-4 border border-destructive/30 flex-row items-center justify-center gap-3">
            <Icon name="LogOut" size={20} color="#ef4444" />
            <Text className="text-destructive text-base font-bold">Logout</Text>
          </View>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};

export default User;
