// Global Imports
import { router, Stack, Tabs } from "expo-router";
import { Platform } from "react-native";
import { Modal } from "~/components/ui-components";

// Local Imports
import { Icon } from "~/lib/icons/Icon";

const TabsLayout = () => {
  return (
    <>
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
                name="Tag"
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
