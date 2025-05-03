// Global Imports
import { Redirect, Tabs } from "expo-router";
import { Platform } from "react-native";

// Local Imports
import Icon from "~/lib/icons/Icon";
import { useAuthStore } from "~/store/authStore";

const TabsLayout = () => {
  const { user } = useAuthStore();

  if (!user) {
    return <Redirect href={"/auth"} />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          height: Platform.OS === "ios" ? 80 : 70,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Records",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Icon name="ReceiptText" color={color} size={28} />
          ),
        }}
      />
      <Tabs.Screen
        name="analysis"
        options={{
          title: "Analysis",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Icon name="ChartPie" color={color} size={28} />
          ),
        }}
      />
      <Tabs.Screen
        name="budgets"
        options={{
          title: "Budgets",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Icon name="Calculator" color={color} size={28} />
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
            <Icon name="ChartColumnStacked" color={color} size={28} />
          ),
        }}
      />
    </Tabs>
  );
};
export default TabsLayout;
