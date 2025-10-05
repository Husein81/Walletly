// Global imports
import { addMonths, format, subMonths, isThisMonth } from "date-fns";
import { View, Pressable } from "react-native";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react-native";

// Local imports
import { Text } from "../ui/text";
import { cn } from "@/lib/utils";
import { Icon } from "@/lib/icons/Icon";

type Props = {
  date: Date;
  onChange: (date: Date) => void;
  onFilterPress?: () => void;
  showCalendarIcon?: boolean;
  variant?: "default" | "compact" | "minimal";
};

const DateFilter = ({
  date,
  onChange,
  onFilterPress,
  showCalendarIcon = false,
  variant = "default",
}: Props) => {
  const isCurrentMonth = isThisMonth(date);

  const handlePrev = () => {
    const newDate = subMonths(date, 1);
    onChange(newDate);
  };

  const handleNext = () => {
    const newDate = addMonths(date, 1);
    onChange(newDate);
  };

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

  // Default variant - modern card style
  return (
    <View className="my-6">
      {/* Modern Card Container */}
      <View className="bg-card rounded-2xl border border-border/50 shadow-lg overflow-hidden">
        <View className="flex-row items-center justify-between px-4 py-3">
          {/* Previous Month Button */}
          <Pressable
            onPress={handlePrev}
            className={cn(
              "h-10 w-10 items-center justify-center rounded-xl",
              "bg-secondary/50 active:bg-secondary",
              "web:hover:bg-secondary web:transition-colors"
            )}
          >
            <Icon
              name="ChevronLeft"
              size={18}
              onPress={handlePrev}
              color={"#4B5563"}
              strokeWidth={2.5}
            />
          </Pressable>

          {/* Date Display */}
          <Pressable
            onPress={onFilterPress}
            disabled={!onFilterPress}
            className={cn(
              "flex-1 mx-3 flex-row items-center justify-center gap-2 py-2 px-4 rounded-xl",
              onFilterPress &&
                "active:bg-secondary/30 web:hover:bg-secondary/20 web:transition-colors"
            )}
          >
            {showCalendarIcon && (
              <Icon
                name="Calendar"
                color={"#4B5563"}
                size={18}
                className="text-primary"
                strokeWidth={2}
              />
            )}
            <View className="items-center">
              <Text className="text-xl font-bold text-foreground">
                {format(date, "MMMM")}
              </Text>
              <Text className="text-sm text-muted-foreground font-medium">
                {format(date, "yyyy")}
              </Text>
            </View>
            {isCurrentMonth && (
              <View className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-primary" />
            )}
          </Pressable>

          {/* Next Month Button */}
          <Pressable
            onPress={handleNext}
            className={cn(
              "h-10 w-10 items-center justify-center rounded-xl",
              "bg-secondary/50 active:bg-secondary",
              "web:hover:bg-secondary web:transition-colors"
            )}
          >
            <Icon
              name="ChevronRight"
              size={18}
              color="#4B5563"
              onPress={handleNext}
              strokeWidth={2.5}
            />
          </Pressable>
        </View>

        {/* Optional: Date Range Indicator */}
        {isCurrentMonth && (
          <View className="px-4 pb-2">
            <View className="bg-primary/10 rounded-lg px-3 py-1.5">
              <Text className="text-xs font-medium text-primary text-center">
                Current Month
              </Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

export default DateFilter;
