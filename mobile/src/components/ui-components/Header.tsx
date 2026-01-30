import { View } from "react-native";

// Local imports
import { Text } from "../ui/text";
import DateFilter from "./DateFilter";

// Store imports
import { useAuthStore, useDateStore } from "@/store";
import UserDropdown from "./user-dropdown";

type Props = {
  dateVariant?: "compact" | "default" | "minimal" | undefined;
};

export const Header = ({ dateVariant }: Props) => {
  const { user } = useAuthStore();
  const { selectedDate, setSelectedDate } = useDateStore();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <View className="pt-4 pb-3">
      {/* Header Top Section */}
      <View className="flex-row justify-between items-center mb-6">
        {/* User Info with Gradient Accent */}
        <View className="flex-1">
          <View className="flex-row items-center gap-2 mb-2">
            <View className="bg-primary/10 border border-primary rounded-xl px-2 py-1">
              <Text className="text-xs text-primary font-semibold">
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
        <UserDropdown />
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
