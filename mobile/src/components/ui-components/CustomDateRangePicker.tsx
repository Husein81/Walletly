import { useState } from "react";
import { View, Pressable } from "react-native";
import { format, isBefore } from "date-fns";
import { Calendar, DateData } from "react-native-calendars";
import { Text } from "../ui/text";
import { useColorScheme } from "@/lib/useColorScheme";
import { useDateStore, useModalStore } from "@/store";
import { SafeAreaView } from "react-native-safe-area-context";
import { NAV_THEME } from "@/lib/theme";

type MarkedDates = {
  startingDay?: boolean;
  endingDay?: boolean;
  color: string;
  textColor: string;
};

const CustomDateRangePicker = () => {
  const { onClose } = useModalStore();
  const { isDarkColorScheme } = useColorScheme();
  const {
    customStartDate,
    customEndDate,
    setCustomDateRange,
    setDateRangeType,
    setSelectedDate,
  } = useDateStore();

  const [startDate, setStartDate] = useState<string | null>(
    customStartDate ? format(customStartDate, "yyyy-MM-dd") : null,
  );
  const [endDate, setEndDate] = useState<string | null>(
    customEndDate ? format(customEndDate, "yyyy-MM-dd") : null,
  );

  const handleCustomDateRange = (startDate: Date, endDate: Date) => {
    setDateRangeType("custom");
    setCustomDateRange(startDate, endDate);
    setSelectedDate(startDate);
  };

  const handleDayPress = (day: DateData) => {
    const selectedDate = day.dateString;

    if (!startDate) {
      setStartDate(selectedDate);
      setEndDate(null);
    } else if (!endDate) {
      if (isBefore(new Date(selectedDate), new Date(startDate))) {
        setStartDate(selectedDate);
        setEndDate(null);
      } else {
        setEndDate(selectedDate);
      }
    } else {
      // Reset and start new selection
      setStartDate(selectedDate);
      setEndDate(null);
    }
  };

  const getMarkedDates = () => {
    if (!startDate) return {};

    const marked: Record<string, MarkedDates> = {};

    // Start date
    marked[startDate] = {
      startingDay: true,
      color: "#14B8A6",
      textColor: "#ffffff",
    };

    if (!endDate) return marked;

    // End date
    marked[endDate] = {
      endingDay: true,
      color: "#14B8A6",
      textColor: "#ffffff",
    };

    let current = new Date(startDate);
    const end = new Date(endDate);

    current.setDate(current.getDate() + 1);

    while (current < end) {
      const dateStr = format(current, "yyyy-MM-dd");
      marked[dateStr] = {
        color: "#14B8A633",
        textColor: "#ffffff",
      };
      current.setDate(current.getDate() + 1);
    }

    return marked;
  };

  const handleApply = () => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      setCustomDateRange(start, end);
      handleCustomDateRange(start, end);
      onClose();
      handleReset();
    }
  };

  const handleReset = () => {
    setStartDate(null);
    setEndDate(null);
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 py-4">
        {/* Date Display */}
        <View className="flex-row gap-3 mb-6">
          <View className="flex-1 px-4 py-3 border rounded-lg border-input bg-card">
            <Text className="text-muted-foreground text-xs mb-1">
              Start Date
            </Text>
            <Text className="text-foreground font-semibold">
              {startDate
                ? format(new Date(startDate), "MMM dd, yyyy")
                : "Select date"}
            </Text>
          </View>
          <View className="flex-1 px-4 py-3 border rounded-lg border-input bg-card">
            <Text className="text-muted-foreground text-xs mb-1">End Date</Text>
            <Text className="text-foreground font-semibold">
              {endDate
                ? format(new Date(endDate), "MMM dd, yyyy")
                : "Select date"}
            </Text>
          </View>
        </View>

        {/* Calendar */}
        <View className="mb-6 bg-card rounded p-2">
          <Calendar
            current={format(new Date(), "yyyy-MM-dd")}
            minDate="2020-01-01"
            maxDate={format(new Date(), "yyyy-MM-dd")}
            onDayPress={handleDayPress}
            markedDates={getMarkedDates()}
            markingType="period"
            theme={{
              backgroundColor: isDarkColorScheme
                ? NAV_THEME.dark.colors.card
                : NAV_THEME.light.colors.card,
              calendarBackground: isDarkColorScheme
                ? NAV_THEME.dark.colors.card
                : NAV_THEME.light.colors.card,
              textSectionTitleColor: isDarkColorScheme ? "#9ca3af" : "#4b5563",
              selectedDayBackgroundColor: "#14B8A6",
              selectedDayTextColor: "#ffffff",
              todayTextColor: NAV_THEME.light.colors.text,
              todayBackgroundColor: isDarkColorScheme
                ? NAV_THEME.dark.colors.primary
                : NAV_THEME.light.colors.primary,
              dayTextColor: isDarkColorScheme
                ? NAV_THEME.dark.colors.text
                : NAV_THEME.light.colors.text,
              textDisabledColor: isDarkColorScheme ? "#4b5563" : "#d9e1e8",
              dotColor: "#14B8A6",
              selectedDotColor: "#ffffff",
              monthTextColor: isDarkColorScheme ? "#e5e7eb" : "#2c3e50",
              arrowColor: "#14B8A6",
            }}
          />
        </View>

        {/* Action Buttons */}
        <View className="flex-row gap-3">
          <Pressable
            onPress={handleReset}
            className="flex-1 py-3 border border-border rounded-lg items-center"
          >
            <Text className="text-foreground font-semibold">Reset</Text>
          </Pressable>
          <Pressable
            onPress={handleApply}
            disabled={!startDate || !endDate}
            className={`flex-1 py-3 rounded-lg items-center ${
              startDate && endDate ? "bg-primary" : "bg-primary/50"
            }`}
          >
            <Text className="text-primary-foreground font-semibold">
              Apply Range
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default CustomDateRangePicker;
