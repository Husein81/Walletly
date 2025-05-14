// Global Imports
import { Tabs } from "expo-router";
import { Platform } from "react-native";

// Local Imports
import { Icon } from "~/lib/icons/Icon";

const TabsLayout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          height: Platform.OS === "ios" ? 80 : 70,
        },
      }}
    >
      <Tabs.Screen
        name="(home)"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Icon name="House" color={color} size={28} />
          ),
        }}
      />
      <Tabs.Screen
        name="analysis"
        options={{
          title: "Analysis",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Icon name="ChartNoAxesColumnIncreasing" color={color} size={28} />
          ),
        }}
      />
      <Tabs.Screen
        name="accounts"
        options={{
          title: "Accounts",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Icon name="Wallet" color={color} size={28} />
          ),
        }}
      />
      <Tabs.Screen
        name="categories"
        options={{
          title: "Categories",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Icon name="Tag" color={color} size={28} />
          ),
        }}
      />
    </Tabs>
  );
};
export default TabsLayout;
