// Global imports
import { addMonths, format, subMonths } from "date-fns";
import { View } from "react-native";
import { useState } from "react";

// Local imports
import { NAV_THEME } from "~/lib/config";
import { Icon } from "~/lib/icons/Icon";
import { useColorScheme } from "~/lib/useColorScheme";
import { Text } from "../ui/text";

type Props = {
  date: Date;
  onChange: (date: Date) => void;
  onFilterPress?: () => void;
};

const DateFilter = ({ date, onChange }: Props) => {
  const { isDarkColorScheme } = useColorScheme();

  const handlePrev = () => {
    const newDate = subMonths(date, 1);
    onChange(newDate);
  };

  const handleNext = () => {
    const newDate = addMonths(date, 1);
    onChange(newDate);
  };

  return (
    <View className="flex-row justify-between items-center gap-4 p-2 mt-4">
      <Icon
        name="ChevronLeft"
        color={
          isDarkColorScheme ? NAV_THEME.dark.primary : NAV_THEME.light.primary
        }
        onPress={handlePrev}
      />

      <Text className="text-lg font-semibold text-primary">
        {format(date, "MMMM yyyy")}
      </Text>

      <Icon
        name="ChevronRight"
        color={
          isDarkColorScheme ? NAV_THEME.dark.primary : NAV_THEME.light.primary
        }
        onPress={handleNext}
      />
    </View>
  );
};

export default DateFilter;
