// Global Imports
import { Modal } from "@/components/ui-components";
import { router, Tabs } from "expo-router";
import { Platform } from "react-native";

// Local Imports
import { Icon } from "@/lib/icons/Icon";

const TabsLayout = () => {
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarStyle: {
            height: Platform.OS === "ios" ? 80 : 70,
            elevation: 0,
            borderTopWidth: 0,
            opacity: 0.95,
            position: "absolute",
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <Icon
                onPress={() => router.replace("/")}
                name="House"
                color={color}
                size={28}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="analysis"
          options={{
            title: "Analysis",
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <Icon
                onPress={() => router.replace("/analysis")}
                name="ChartNoAxesColumnIncreasing"
                color={color}
                size={28}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="accounts"
          options={{
            title: "Accounts",
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <Icon
                onPress={() => router.replace("/accounts")}
                name="Wallet"
                color={color}
                size={28}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="categories"
          options={{
            title: "Categories",
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <Icon
                onPress={() => router.replace("/categories")}
                name="LayoutGrid"
                color={color}
                size={28}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="user"
          options={{
            headerShown: false,
            title: "User",
            tabBarIcon: ({ color }) => (
              <Icon
                onPress={() => router.replace("/user")}
                name="User"
                color={color}
                size={28}
              />
            ),
          }}
        />
      </Tabs>
      <Modal />
    </>
  );
};
export default TabsLayout;
