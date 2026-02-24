// Global imports
import { startOfMonth, startOfWeek } from "date-fns";
import { Pressable, ScrollView, View } from "react-native";

// Local imports
import { Icon } from "@/components/ui";
import { useColorScheme } from "@/lib/useColorScheme";
import { cn } from "@/lib/utils";
import { useModalStore } from "@/store";
import { DateRangeType, useDateStore } from "@/store/dateStore";
import { getDateRangeLabel } from "@/utils";
import { Text } from "../ui/text";
import CustomDateRangePicker from "./CustomDateRangePicker";

const DateFilter = () => {
  const { isDarkColorScheme } = useColorScheme();
  const {
    dateRangeType,
    setDateRangeType,
    setSelectedDate: onChange,
    customStartDate,
    setCustomDateRange,
    customEndDate,
  } = useDateStore();
  const selectedRange = dateRangeType;
  const { onOpen } = useModalStore();

  const handleReset = () => {
    setCustomDateRange(undefined, undefined);
  };

  const handleQuickFilter = (range: DateRangeType) => {
    setDateRangeType(range);
    handleReset();
    const now = new Date();

    switch (range) {
      case "today":
        onChange(now);
        break;
      case "week":
        onChange(startOfWeek(now, { weekStartsOn: 1 }));
        break;
      case "month":
        onChange(startOfMonth(now));
        break;
      default:
        break;
    }
  };

  const handleOpen = () => {
    onOpen(<CustomDateRangePicker />, "Custom Range");
  };

  const quickFilters = [
    { label: "Today", value: "today" as DateRangeType, icon: "Calendar" },
    { label: "Week", value: "week" as DateRangeType, icon: "CalendarDays" },
    { label: "Month", value: "month" as DateRangeType, icon: "CalendarRange" },
    {
      label: "Custom",
      value: "custom" as DateRangeType,
      icon: "Settings2",
      onPress: handleOpen,
    },
  ];

  // Default variant - modern professional design with filters
  return (
    <View className="my-4">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-muted-foreground">Filter by date</Text>
        <Text>
          {getDateRangeLabel(selectedRange, customStartDate, customEndDate)}
        </Text>
      </View>
      {/* Quick Date Range Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mb-4"
      >
        <View className="flex-row gap-2">
          {quickFilters.map((filter) => (
            <Pressable
              key={filter.value}
              onPress={() => {
                if (filter.onPress) {
                  filter.onPress();
                } else {
                  handleQuickFilter(filter.value);
                }
              }}
              className={cn(
                "px-4 py-2.5 rounded-full active:opacity-70 ",
                selectedRange === filter.value
                  ? "bg-primary"
                  : "bg-card border border-border",
              )}
            >
              <View className="flex-row items-center gap-2">
                <Icon
                  name={filter.icon}
                  size={16}
                  color={
                    selectedRange === filter.value
                      ? "#ffffff"
                      : isDarkColorScheme
                        ? "#e4e4e7"
                        : "#3f3f46"
                  }
                  strokeWidth={2}
                />
                <Text
                  className="text-sm font-semibold"
                  style={{
                    color:
                      selectedRange === filter.value
                        ? "#ffffff"
                        : isDarkColorScheme
                          ? "#e4e4e7"
                          : "#3f3f46",
                  }}
                >
                  {filter.label}
                </Text>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default DateFilter;
