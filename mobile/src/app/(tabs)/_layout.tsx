// Global Imports
import { Tabs } from "expo-router";
import { Platform, TouchableOpacity, View } from "react-native";
import { BlurView } from "expo-blur";

// Local Imports
import { ExpenseForm } from "@/components/Expense";
import { Icon } from "@/components/ui";
import { useModalStore } from "@/store";
import { useThemeStore } from "@/store/themStore";
import { NAV_THEME } from "@/lib/theme";

const TabsLayout = () => {
  const { onOpen } = useModalStore();
  const { isDark } = useThemeStore();

  const theme = isDark ? NAV_THEME.dark.colors : NAV_THEME.light.colors;

  const activeColor = theme.primary;
  const inactiveColor = theme.mutedForeground;

  const openExpense = () => onOpen(<ExpenseForm />, "New Expense");

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,
        tabBarShowLabel: true,

        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
          marginTop: 2,
        },

        // iOS Glass Background
        tabBarBackground: () =>
          Platform.OS === "ios" ? (
            <BlurView
              intensity={80}
              tint={isDark ? "dark" : "light"}
              style={{
                flex: 1,
                borderRadius: 28,
                overflow: "hidden",
              }}
            />
          ) : (
            <View
              style={{
                flex: 1,
                backgroundColor: theme.background,
                borderRadius: 28,
              }}
            />
          ),

        tabBarStyle: {
          position: "absolute",
          left: 16,
          right: 16,
          bottom: Platform.OS === "ios" ? 20 : 12,
          height: Platform.OS === "ios" ? 72 : 65,
          paddingTop: 10,
          paddingBottom: Platform.OS === "ios" ? 18 : 12,

          borderRadius: 28,
          backgroundColor: "transparent",
          borderWidth: Platform.OS === "ios" ? 0.5 : 1,
          borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",

          elevation: 10,
          shadowColor: "#000",
          shadowOpacity: isDark ? 0.35 : 0.15,
          shadowRadius: 24,
          shadowOffset: { width: 0, height: 10 },
        },
      }}
    >
      {/* Home */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <Icon name="House" size={22} color={color} />
          ),
        }}
      />

      {/* Stats */}
      <Tabs.Screen
        name="analysis"
        options={{
          title: "Stats",
          tabBarIcon: ({ color }) => (
            <Icon name="ChartPie" size={22} color={color} />
          ),
        }}
      />

      {/* Center FAB */}
      <Tabs.Screen
        name="expense"
        options={{
          title: "",
          tabBarLabel: () => null,
          tabBarIcon: () => (
            <TouchableOpacity
              onPress={() => onOpen(<ExpenseForm />, "New Expense")}
            >
              <View
                className="items-center justify-center"
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 28,
                  backgroundColor: activeColor,
                  marginBottom: Platform.OS === "ios" ? 24 : 20,
                  shadowColor: activeColor,
                  shadowOpacity: isDark ? 0.4 : 0.35,
                  shadowRadius: 10,
                  shadowOffset: { width: 0, height: 6 },
                  elevation: 8,
                }}
              >
                <Icon
                  name="Plus"
                  size={28}
                  color={NAV_THEME.light.colors.background}
                  onPress={() => onOpen(<ExpenseForm />, "New Expense")}
                />
              </View>
            </TouchableOpacity>
          ),
        }}
      />

      {/* Wallet */}
      <Tabs.Screen
        name="wallets"
        options={{
          title: "Wallet",
          tabBarIcon: ({ color }) => (
            <Icon name="Wallet" size={22} color={color} />
          ),
        }}
      />

      {/* Profile */}
      <Tabs.Screen
        name="user"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <Icon name="User" size={22} color={color} />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
