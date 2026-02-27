import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from "@react-navigation/drawer";
import { View } from "react-native";

// Local Imports
import { Icon } from "@/components/ui";
import { useThemeStore } from "@/store/themStore";
import { useAuthStore } from "@/store/authStore";
import { Switch } from "../ui/switch";
import { useEffect, useRef } from "react";
import { NAV_THEME } from "@/lib/theme";

export const CustomDrawer = (props: any) => {
  const { clearAuth } = useAuthStore();

  const { isDark, toggleColorScheme } = useThemeStore();

  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const handleLogout = async () => {
    try {
      if (isMounted.current) {
        clearAuth();
        props.navigation?.closeDrawer?.();
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <DrawerContentScrollView {...props}>
      <View className="px-4 pt-4">
        <View className="flex-row-reverse items-center justify-between w-full  mb-4 gap-4">
          <Switch checked={isDark} onCheckedChange={toggleColorScheme} />
          <Icon
            name={isDark ? "Moon" : "Sun"}
            color={
              isDark
                ? NAV_THEME.dark.colors.primary
                : NAV_THEME.light.colors.primary
            }
          />
        </View>

        <DrawerItemList {...props} />

        <DrawerItem
          icon={() => (
            <Icon
              color={
                isDark
                  ? NAV_THEME.dark.colors.primary
                  : NAV_THEME.light.colors.primary
              }
              name="LogOut"
            />
          )}
          label={"Logout"}
          onPress={handleLogout}
        />
      </View>
    </DrawerContentScrollView>
  );
};
