// Global imports
import {
  addMonths,
  format,
  isSameWeek,
  isSameYear,
  isThisMonth,
  isToday,
  startOfMonth,
  startOfWeek,
  startOfYear,
  subMonths,
} from "date-fns";
import { useState } from "react";
import { Pressable, ScrollView, View } from "react-native";

// Local imports
import { Icon } from "@/lib/icons/Icon";
import { useColorScheme } from "@/lib/useColorScheme";
import { Text } from "../ui/text";

type DateRangeType = "today" | "week" | "month" | "year" | "custom";

type Props = {
  date: Date;
  onChange: (date: Date) => void;
  onFilterPress?: () => void;
  showCalendarIcon?: boolean;
  variant?: "default" | "compact" | "minimal";
  showQuickFilters?: boolean;
};

const DateFilter = ({
  date,
  onChange,
  onFilterPress,
  showCalendarIcon = false,
  variant = "default",
  showQuickFilters = true,
}: Props) => {
  const { isDarkColorScheme } = useColorScheme();
  const isCurrentMonth = isThisMonth(date);
  const [selectedRange, setSelectedRange] = useState<DateRangeType>("month");

  const handlePrev = () => {
    const newDate = subMonths(date, 1);
    onChange(newDate);
  };

  const handleNext = () => {
    const newDate = addMonths(date, 1);
    onChange(newDate);
  };

  const handleQuickFilter = (range: DateRangeType) => {
    setSelectedRange(range);
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
      case "year":
        onChange(startOfYear(now));
        break;
      default:
        break;
    }
  };

  const getDateRangeLabel = () => {
    const now = new Date();

    if (isToday(date)) return "Today";
    if (isSameWeek(date, now, { weekStartsOn: 1 })) return "This Week";
    if (isCurrentMonth) return "This Month";
    if (isSameYear(date, now)) return format(date, "MMMM");
    return format(date, "MMM yyyy");
  };

  const quickFilters = [
    { label: "Today", value: "today" as DateRangeType, icon: "Calendar" },
    { label: "Week", value: "week" as DateRangeType, icon: "CalendarDays" },
    { label: "Month", value: "month" as DateRangeType, icon: "CalendarRange" },
    { label: "Year", value: "year" as DateRangeType, icon: "CalendarClock" },
  ];

  // Compact variant for space-constrained layouts
  if (variant === "compact") {
    return (
      <View className="flex-row items-center justify-between bg-card rounded-xl border border-border/50 py-2 px-3 my-2">
        <Pressable
          onPress={handlePrev}
          className="h-8 w-8 items-center justify-center rounded-lg bg-secondary/50 active:bg-secondary"
        >
          <Icon
            name="ChevronLeft"
            size={18}
            onPress={handlePrev}
            color={"#4B5563"}
            strokeWidth={2.5}
          />
        </Pressable>

        <Pressable
          onPress={onFilterPress}
          disabled={!onFilterPress}
          className="flex-1 mx-2 flex-row items-center justify-center gap-1.5"
        >
          {showCalendarIcon && (
            <Icon name="Calendar" color={"#"} size={14} strokeWidth={2} />
          )}
          <Text className="text-base font-semibold text-foreground">
            {format(date, "MMM yyyy")}
          </Text>
          {isCurrentMonth && (
            <View className="h-1.5 w-1.5 rounded-full bg-primary ml-1" />
          )}
        </Pressable>

        <Pressable
          onPress={handleNext}
          className="h-8 w-8 items-center justify-center rounded-lg bg-secondary/50 active:bg-secondary"
        >
          <Icon
            name="ChevronRight"
            size={18}
            color={"#4B5563"}
            onPress={handleNext}
            strokeWidth={2.5}
          />
        </Pressable>
      </View>
    );
  }

  // Minimal variant for inline use
  if (variant === "minimal") {
    return (
      <View className="flex-row items-center justify-center gap-3 py-2">
        <Pressable
          onPress={handlePrev}
          className="h-9 w-9 items-center justify-center rounded-full active:bg-secondary/50"
        >
          <Icon
            name="ChevronLeft"
            size={18}
            onPress={handlePrev}
            color={"#4B5563"}
            strokeWidth={2.5}
          />
        </Pressable>

        <Pressable
          onPress={onFilterPress}
          disabled={!onFilterPress}
          className="flex-row items-center gap-2 px-3 py-1.5 rounded-lg active:bg-secondary/30"
        >
          {showCalendarIcon && (
            <Icon
              name="Calendar"
              color={"#4B5563"}
              size={16}
              className="text-primary"
              strokeWidth={2}
            />
          )}
          <Text className="text-lg font-bold text-foreground">
            {format(date, "MMM yyyy")}
          </Text>
        </Pressable>

        <Pressable
          onPress={handleNext}
          className="h-9 w-9 items-center justify-center rounded-full active:bg-secondary/50"
        >
          <Icon
            name="ChevronRight"
            size={18}
            onPress={handleNext}
            color={"#4B5563"}
            strokeWidth={2.5}
          />
        </Pressable>
      </View>
    );
  }

  // Default variant - modern professional design with filters
  return (
    <View className="my-4">
      {/* Quick Date Range Filters */}
      {showQuickFilters && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mb-4"
        >
          <View className="flex-row gap-2">
            {quickFilters.map((filter) => (
              <Pressable
                key={filter.value}
                onPress={() => handleQuickFilter(filter.value)}
                className="px-4 py-2.5 rounded-full active:opacity-70"
                style={{
                  backgroundColor:
                    selectedRange === filter.value
                      ? "#14B8A6"
                      : isDarkColorScheme
                        ? "rgba(63, 63, 70, 0.5)"
                        : "rgba(228, 228, 231, 0.6)",
                }}
              >
                <View className="flex-row items-center gap-2">
                  <Icon
                    name={filter.icon as any}
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
      )}

      {/* Date Navigator */}
      <View className="flex-row items-center gap-3">
        {/* Previous Button */}
        <Pressable
          onPress={handlePrev}
          className="h-11 w-11 items-center justify-center rounded-xl active:opacity-70"
          style={{
            backgroundColor: isDarkColorScheme
              ? "rgba(63, 63, 70, 0.6)"
              : "rgba(228, 228, 231, 0.7)",
          }}
        >
          <Icon
            name="ChevronLeft"
            size={20}
            color={isDarkColorScheme ? "#e4e4e7" : "#3f3f46"}
            strokeWidth={2.5}
          />
        </Pressable>

        {/* Date Display Card */}
        <View
          className="flex-1 py-3.5 px-4 rounded-xl"
          style={{
            backgroundColor: isDarkColorScheme
              ? "rgba(39, 39, 42, 0.9)"
              : "rgba(255, 255, 255, 0.9)",
            borderWidth: 1,
            borderColor: isDarkColorScheme
              ? "rgba(82, 82, 91, 0.4)"
              : "rgba(212, 212, 216, 0.6)",
          }}
        >
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <Text
                className="text-xs font-medium mb-1"
                style={{
                  color: isDarkColorScheme ? "#a1a1aa" : "#71717a",
                }}
              >
                {getDateRangeLabel()}
              </Text>
              <View className="flex-row items-center gap-2">
                <Icon
                  name="Calendar"
                  size={16}
                  color="#14B8A6"
                  strokeWidth={2}
                />
                <Text className="text-lg font-bold text-foreground">
                  {format(date, "MMM dd, yyyy")}
                </Text>
              </View>
            </View>

            {/* Current Indicator */}
            {isCurrentMonth && (
              <View
                className="px-2.5 py-1 rounded-full"
                style={{
                  backgroundColor: "rgba(20, 184, 166, 0.15)",
                }}
              >
                <Text
                  className="text-xs font-semibold"
                  style={{ color: "#14B8A6" }}
                >
                  Now
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Next Button */}
        <Pressable
          onPress={handleNext}
          className="h-11 w-11 items-center justify-center rounded-xl active:opacity-70"
          style={{
            backgroundColor: isDarkColorScheme
              ? "rgba(63, 63, 70, 0.6)"
              : "rgba(228, 228, 231, 0.7)",
          }}
        >
          <Icon
            name="ChevronRight"
            size={20}
            color={isDarkColorScheme ? "#e4e4e7" : "#3f3f46"}
            strokeWidth={2.5}
          />
        </Pressable>
      </View>
    </View>
  );
};

export default DateFilter;
