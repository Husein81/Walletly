import { Pressable, View } from "react-native";

// Local imports
import { Icon } from "@/lib/icons/Icon";
import { useColorScheme } from "@/lib/useColorScheme";
import { Search } from "../Expense/Search";
import { Text } from "../ui/text";
import DateFilter from "./DateFilter";

// Store imports
import { useAuthStore, useDateStore, useModalStore } from "@/store";
import UserDropdown from "./user-dropdown";

type Props = {
  dateVariant?: "compact" | "default" | "minimal" | undefined;
};

export const Header = ({ dateVariant }: Props) => {
  const { user } = useAuthStore();
  const { onOpen } = useModalStore();
  const { isDarkColorScheme } = useColorScheme();
  const { selectedDate, setSelectedDate } = useDateStore();

  const handleOpenSearch = () => onOpen(<Search />, "Search");

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <View className="pt-4 pb-3">
      {/* Header Top Section */}
      <View className="flex-row justify-between items-start mb-6">
        {/* User Info with Gradient Accent */}
        <View className="flex-1">
          <View className="flex-row items-center gap-2 mb-2">
            <View
              style={{
                backgroundColor: isDarkColorScheme
                  ? "rgba(59, 130, 246, 0.15)"
                  : "rgba(59, 130, 246, 0.1)",
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: "rgba(59, 130, 246, 0.3)",
              }}
            >
              <Text
                style={{ color: "#3b82f6" }}
                className="text-xs font-semibold"
              >
                {getGreeting()} 👋
              </Text>
            </View>
          </View>
          <Text className="text-foreground capitalize text-3xl font-bold tracking-tight">
            {user?.name || "User"}
          </Text>
          {user?.phone && (
            <Text className="text-muted-foreground text-sm mt-1">
              {user.phone}
            </Text>
          )}
        </View>

        {/* Action Buttons */}
        <View className="flex-row items-center gap-2">
          {/* Search Button */}
          <Pressable onPress={handleOpenSearch} className="active:scale-95">
            <View
              style={{
                backgroundColor: isDarkColorScheme
                  ? "rgba(24, 24, 27, 0.8)"
                  : "rgba(250, 250, 250, 0.9)",
                borderWidth: 1,
                borderColor: isDarkColorScheme
                  ? "rgba(63, 63, 70, 0.5)"
                  : "rgba(228, 228, 231, 0.8)",
                padding: 10,
                borderRadius: 16,
                shadowColor: "#000000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 2,
              }}
            >
              <Icon name="Search" size={20} color="#3b82f6" />
            </View>
          </Pressable>

          {/* User Dropdown */}
          <UserDropdown />
        </View>
      </View>

      {/* Date Filter */}
      <DateFilter
        variant={dateVariant}
        date={selectedDate}
        onChange={setSelectedDate}
      />
    </View>
  );
};
