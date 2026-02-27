// Global imports
import { LinearGradient } from "expo-linear-gradient";
import { Alert, Pressable, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

// Local imports
import { Rn, Text } from "@/components/ui";
import UserSection from "@/components/User/user-section";
import { Icon } from "@/components/ui";
import { useThemeStore } from "@/store/themStore";
import { useAuthStore } from "@/store";
import Avatar from "@/components/ui-components/Avatar";
import { THEME } from "@/lib/theme";

const User = () => {
  const { user, clearAuth } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const isDark = theme === "dark";

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
  ];

  const managementSettings = [
    {
      title: "Categories",
      subTitle: "Manage your expense categories",
      icon: "FolderOpen",
      onPress: () => router.push("/user/categories"),
    },
    {
      title: "Currency",
      subTitle: user?.currency.symbol || "$",
      icon: "CircleDollarSign",
      onPress: () => router.push("/user/currency-sign"),
    },
  ];

  const preferences = [
    {
      title: "Appearance",
      subTitle: isDark ? "Dark Mode" : "Light Mode",
      icon: isDark ? "Moon" : "Sun",
      onPress: toggleTheme,
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

  const fallback =
    user?.name?.slice(0, 2).toUpperCase() ??
    user?.username.slice(0, 2).toUpperCase() ??
    "U";

  const backgroundColor = isDark
    ? THEME.dark.background
    : THEME.light.background;

  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor }}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header with Vercel Gradient */}
        <View className="px-5 pt-6 pb-8">
          <Rn.Card className="p-4 rounded-2xl overflow-hidden">
            <View className="flex-row items-center gap-4">
              {/* Avatar */}
              <Avatar fallback={fallback} size={64} />

              {/* User Info */}
              <View>
                <Text
                  style={{ color: isDark ? "#ffffff" : "#18181b" }}
                  className="text-2xl font-bold mb-1 capitalize"
                >
                  {user?.username ?? "User"}
                </Text>
                {user?.email && (
                  <Text
                    style={{ color: isDark ? "#a1a1aa" : "#52525b" }}
                    className="text-sm mb-4"
                  >
                    {user?.email}
                  </Text>
                )}
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
