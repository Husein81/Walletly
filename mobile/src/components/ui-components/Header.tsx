import { View } from "react-native";

// Local imports
import { NAV_THEME } from "~/lib/config";
import { Icon } from "~/lib/icons/Icon";
import { useColorScheme } from "~/lib/useColorScheme";
import { Search } from "../Expense/Search";
import DateFilter from "./DateFilter";
import { Text } from "../ui/text";

// Store imports
import { useDateStore, useModalStore, useAuthStore } from "~/store";

export const Header = () => {
  const { user, clearAuth } = useAuthStore();
  const { onOpen } = useModalStore();
  const { isDarkColorScheme, toggleColorScheme } = useColorScheme();
  const { selectedDate, setSelectedDate } = useDateStore();

  const handleOpenSearch = () => onOpen(<Search />, "Search");
  return (
    <View>
      <View className="flex-row justify-between items-center">
        <View>
          <Text className="text-primary capitalize ml-2">Hello,</Text>
          <Text className="text-primary capitalize text-xl font-semibold ml-2">
            {user?.name ?? "User" + user?.id?.slice(-4)}
          </Text>
        </View>
        <View className="flex-row items-center gap-4">
          <Icon
            name="Search"
            className="rounded-full bg-iron/65 p-2"
            size={20}
            color={
              isDarkColorScheme
                ? NAV_THEME.dark.primary
                : NAV_THEME.light.primary
            }
            onPress={handleOpenSearch}
          />
          <Icon
            onPress={toggleColorScheme}
            name={isDarkColorScheme ? "Moon" : "Sun"}
            className="rounded-full bg-iron/65 p-2"
            size={20}
            color={
              isDarkColorScheme
                ? NAV_THEME.dark.primary
                : NAV_THEME.light.primary
            }
          />
          <Icon
            name="LogOut"
            size={20}
            color={
              isDarkColorScheme
                ? NAV_THEME.dark.primary
                : NAV_THEME.light.primary
            }
            onPress={clearAuth}
          />
        </View>
      </View>
      <DateFilter date={selectedDate} onChange={setSelectedDate} />
    </View>
  );
};
