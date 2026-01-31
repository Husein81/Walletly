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
  subDays,
  subMonths,
} from "date-fns";
import { Pressable, ScrollView, View } from "react-native";

// Local imports
import { Icon } from "@/lib/icons/Icon";
import { useColorScheme } from "@/lib/useColorScheme";
import { Text } from "../ui/text";
import { useDateStore, DateRangeType } from "@/store/dateStore";
import { cn } from "@/lib/utils";

type Props = {
  date: Date;
  onChange: (date: Date) => void;
  onFilterPress?: () => void;
  showCalendarIcon?: boolean;
  showQuickFilters?: boolean;
};

const DateFilter = ({
  date,
  onChange,
  onFilterPress,
  showCalendarIcon = false,
  showQuickFilters = true,
}: Props) => {
  const { isDarkColorScheme } = useColorScheme();
  const isCurrentMonth = isThisMonth(date);
  const { dateRangeType, setDateRangeType } = useDateStore();
  const selectedRange = dateRangeType;

  const handlePrev = () => {
    const newDate = subMonths(date, 1);
    onChange(newDate);
  };

  const handleNext = () => {
    const newDate = addMonths(date, 1);
    onChange(newDate);
  };

  const handleQuickFilter = (range: DateRangeType) => {
    setDateRangeType(range);
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

  const getDateRangeLabel = (range: DateRangeType) => {
    const today = new Date();

    if (range === "today") {
      return "Today";
    }

    if (range === "week") {
      const start = subDays(today, 7);
      return `${format(start, "dd MMM")} – ${format(today, "dd MMM")}`;
    }

    if (range === "month") {
      const start = subMonths(today, 1);
      return `${format(start, "dd MMM")} – ${format(today, "dd MMM")}`;
    }

    if (range === "year") {
      return format(today, "yyyy");
    }

    return "";
  };

  const quickFilters = [
    { label: "Today", value: "today" as DateRangeType, icon: "Calendar" },
    { label: "Week", value: "week" as DateRangeType, icon: "CalendarDays" },
    { label: "Month", value: "month" as DateRangeType, icon: "CalendarRange" },
    { label: "Year", value: "year" as DateRangeType, icon: "CalendarClock" },
  ];

  // Default variant - modern professional design with filters
  return (
    <View className="my-4">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-muted-foreground">Filter by date</Text>
        <Text>{getDateRangeLabel(selectedRange)}</Text>
      </View>
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
                className={cn(
                  "px-4 py-2.5 rounded-full active:opacity-70 ",
                  selectedRange === filter.value
                    ? "bg-primary"
                    : "bg-card border border-border",
                )}
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
    </View>
  );
};

export default DateFilter;
