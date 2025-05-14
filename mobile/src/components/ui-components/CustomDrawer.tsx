import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from "@react-navigation/drawer";
import { View } from "react-native";

// Local Imports
import { useLogout } from "~/hooks/auth";
import { NAV_THEME } from "~/lib/constants";
import { Icon } from "~/lib/icons/Icon";
import { useColorScheme } from "~/lib/useColorScheme";
import { useAuthStore } from "~/store/authStore";
import { Switch } from "../ui/switch";
import { useEffect, useRef } from "react";

export const CustomDrawer = (props: any) => {
  const { mutateAsync } = useLogout();
  const { clearAuth } = useAuthStore();

  const { isDarkColorScheme, toggleColorScheme } = useColorScheme();

  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const handleLogout = async () => {
    await mutateAsync();
    if (isMounted.current) {
      clearAuth();
      props.navigation?.closeDrawer?.();
    }
  };

  return (
    <DrawerContentScrollView {...props}>
      <View className="px-4 pt-4">
        <View className="flex-row-reverse items-center justify-between w-full  mb-4 gap-4">
          <Switch
            checked={isDarkColorScheme}
            onCheckedChange={toggleColorScheme}
          />
          <Icon
            name={isDarkColorScheme ? "Moon" : "Sun"}
            color={
              isDarkColorScheme
                ? NAV_THEME.dark.primary
                : NAV_THEME.light.primary
            }
          />
        </View>
        <DrawerItemList {...props} />
        <DrawerItem label={"Logout"} onPress={handleLogout} />
      </View>
    </DrawerContentScrollView>
  );
};
