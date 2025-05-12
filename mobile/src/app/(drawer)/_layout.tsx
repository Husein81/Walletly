import { Redirect } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { CustomDrawer } from "~/components/ui-components";
import { NAV_THEME } from "~/lib/constants";

// Local Imports
import { Icon } from "~/lib/icons/Icon";
import { useColorScheme } from "~/lib/useColorScheme";
import { useAuthStore } from "~/store/authStore";

const DrawerLayout = () => {
  const { isDarkColorScheme } = useColorScheme();
  const { user, token } = useAuthStore();

  if (!user || !token) {
    return <Redirect href="/auth" />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={CustomDrawer}
        screenOptions={{
          drawerStyle: { borderRadius: 0 },
          drawerItemStyle: {
            borderRadius: 15,
          },
        }}
      >
        <Drawer.Protected guard={!!user}>
          <Drawer.Screen
            name="(tabs)"
            options={{
              title: "My Wallet",
            }}
          />

          <Drawer.Screen
            name="settings"
            options={{
              title: "Settings",
              drawerIcon: () => (
                <Icon
                  name="Settings"
                  color={
                    isDarkColorScheme
                      ? NAV_THEME.dark.primary
                      : NAV_THEME.light.primary
                  }
                />
              ),
            }}
          />
        </Drawer.Protected>
      </Drawer>
    </GestureHandlerRootView>
  );
};
export default DrawerLayout;
