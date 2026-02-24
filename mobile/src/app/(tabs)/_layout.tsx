// Global Imports
import { Tabs } from "expo-router";
import { Platform, TouchableOpacity, View } from "react-native";

// Local Imports
import { ExpenseForm } from "@/components/Expense";
import { Icon } from "@/components/ui";
import { useModalStore } from "@/store";
import { useColorScheme } from "@/lib/useColorScheme";
import { NAV_THEME } from "@/lib/theme";

const TabsLayout = () => {
  const { onOpen } = useModalStore();
  const { isDarkColorScheme } = useColorScheme();

  const activeColor = isDarkColorScheme
    ? NAV_THEME.dark.colors.primary
    : NAV_THEME.light.colors.primary;
  const inactiveColor = isDarkColorScheme
    ? NAV_THEME.dark.colors.mutedForeground
    : NAV_THEME.light.colors.mutedForeground;

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarBackground: () => (
            <View
              style={{
                flex: 1,
                borderTopWidth: 1,
                borderTopColor: isDarkColorScheme ? "#333333" : "#e1e1e1",
                backgroundColor: isDarkColorScheme
                  ? NAV_THEME.dark.colors.background
                  : NAV_THEME.light.colors.background,
              }}
            />
          ),
          tabBarShowLabel: true,
          tabBarActiveTintColor: activeColor,
          tabBarInactiveTintColor: inactiveColor,
          tabBarStyle: {
            position: "absolute",
            left: 16,
            right: 16,
            paddingVertical: 8,
            height: Platform.OS === "ios" ? 70 : 65,
            borderTopWidth: 0,
            elevation: 10,
            shadowColor: "#000",
            shadowOpacity: 0.08,
            shadowRadius: 12,
            shadowOffset: { width: 0, height: 4 },
          },
          tabBarLabelStyle: {
            fontSize: 12,
            marginBottom: 6,
            fontWeight: "500",
          },
        }}
      >
        {/* Home */}
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color }) => (
              <Icon name="House" size={24} color={color} />
            ),
          }}
        />

        {/* Stats */}
        <Tabs.Screen
          name="analysis"
          options={{
            title: "Stats",
            tabBarIcon: ({ color }) => (
              <Icon name="ChartPie" size={24} color={color} />
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
                    shadowOpacity: isDarkColorScheme ? 0.4 : 0.35,
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
          name="accounts"
          options={{
            title: "Wallet",
            tabBarIcon: ({ color }) => (
              <Icon name="Wallet" size={24} color={color} />
            ),
          }}
        />

        {/* Profile */}
        <Tabs.Screen
          name="user"
          options={{
            title: "Profile",
            tabBarIcon: ({ color }) => (
              <Icon name="User" size={24} color={color} />
            ),
          }}
        />
      </Tabs>
    </>
  );
};

export default TabsLayout;
