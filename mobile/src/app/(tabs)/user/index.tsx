// Global imports
import { LinearGradient } from "expo-linear-gradient";
import { Alert, Pressable, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

// Local imports
import { Rn, Text } from "@/components/ui";
import UserSection from "@/components/User/user-section";
import { Icon } from "@/lib/icons/Icon";
import { useColorScheme } from "@/lib/useColorScheme";
import { useAuthStore } from "@/store";

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

  const perfernces = [
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
    },
    {
      title: "Privacy Policy",
      subTitle: "Read our privacy policy",
      icon: "FileText",
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
          <LinearGradient
            colors={
              isDarkColorScheme
                ? ["#000000", "#18181b", "#27272a"]
                : ["#fafafa", "#f4f4f5", "#e4e4e7"]
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              borderRadius: 24,
              padding: 32,
              shadowColor: "#000000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.25,
              shadowRadius: 12,
              elevation: 8,
              borderWidth: 1,
              borderColor: isDarkColorScheme
                ? "rgba(63, 63, 70, 0.3)"
                : "rgba(228, 228, 231, 0.8)",
            }}
          >
            <View className="items-center">
              {/* Avatar */}
              <View className="mb-4">
                <Rn.Avatar
                  alt=""
                  className="w-24 h-24 border-4 border-primary/20"
                >
                  <Rn.AvatarImage
                    source={{
                      uri: `https://ui-avatars.com/api/?name=${
                        user?.name || "User"
                      }&size=200&background=3b82f6&color=fff`,
                    }}
                  />
                  <Rn.AvatarFallback className="bg-primary/20">
                    <Text className="text-primary text-3xl font-bold">
                      {user?.name}
                    </Text>
                  </Rn.AvatarFallback>
                </Rn.Avatar>
              </View>

              {/* User Info */}
              <Text
                style={{ color: isDarkColorScheme ? "#ffffff" : "#18181b" }}
                className="text-3xl font-bold mb-1 capitalize"
              >
                {user?.name || "User"}
              </Text>
              <Text
                style={{ color: isDarkColorScheme ? "#a1a1aa" : "#52525b" }}
                className="text-base mb-4"
              >
                {user?.phone}
              </Text>

              {/* Stats Row */}
              <View className="flex-row gap-4 mt-4">
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
                  className="px-4 py-2 rounded-full"
                >
                  <Text
                    style={{ color: isDarkColorScheme ? "#e4e4e7" : "#3f3f46" }}
                    className="text-sm font-semibold"
                  >
                    {user?.role || "USER"}
                  </Text>
                </View>
                {user?.phoneVerified && (
                  <View
                    style={{
                      backgroundColor: "rgba(59, 130, 246, 0.15)",
                      borderWidth: 1,
                      borderColor: "rgba(59, 130, 246, 0.3)",
                    }}
                    className="px-4 py-2 rounded-full flex-row items-center gap-2"
                  >
                    <Icon name="CircleCheck" size={14} color="#3b82f6" />
                    <Text className="text-primary text-sm font-semibold">
                      Verified
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Account Settings Section */}
        <UserSection title="Account" cards={accountSettings} />

        {/* Preferences Section */}
        <UserSection title="Preferences" cards={perfernces} />

        {/* Support Section */}
        <UserSection title="Support" cards={supports} />

        {/* Logout Button */}
        <View className="px-5 mt-4 mb-8">
          <Pressable onPress={handleLogout} className="active:scale-[0.98]">
            <View className="bg-destructive/10 rounded-2xl p-4 border border-destructive/30 flex-row items-center justify-center gap-3">
              <Icon name="LogOut" size={20} color="#ef4444" />
              <Text className="text-destructive text-base font-bold">
                Logout
              </Text>
            </View>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default User;
