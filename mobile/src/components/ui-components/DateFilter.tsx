// Global imports
import { addMonths, format, subMonths } from "date-fns";
import { Text, View } from "react-native";
import { useState } from "react";

// Local imports
import { NAV_THEME } from "~/lib/config";
import { Icon } from "~/lib/icons/Icon";
import { useColorScheme } from "~/lib/useColorScheme";

type Props = {
  date: Date;
  onChange: (date: Date) => void;
  onFilterPress?: () => void;
};

const DateFilter = ({ date, onChange }: Props) => {
  const { isDarkColorScheme } = useColorScheme();
  const [selectedDate, setSelectedDate] = useState(date);

  const handlePrev = () => {
    const newDate = subMonths(selectedDate, 1);
    onChange(newDate);
    setSelectedDate(newDate);
  };

  const handleNext = () => {
    const newDate = addMonths(selectedDate, 1);
    onChange(newDate);
    setSelectedDate(newDate);
  };

  return (
    <View>
      <View className="flex-row justify-between items-center gap-4 p-2 mt-4">
        <Icon
          name="ChevronLeft"
          color={
            isDarkColorScheme ? NAV_THEME.dark.primary : NAV_THEME.light.primary
          }
          onPress={handlePrev}
        />

        <Text className="text-lg font-semibold text-primary">
          {format(selectedDate, "MMMM yyyy")}
        </Text>

        <Icon
          name="ChevronRight"
          color={
            isDarkColorScheme ? NAV_THEME.dark.primary : NAV_THEME.light.primary
          }
          onPress={handleNext}
        />
      </View>
    </View>
  );
};

export default DateFilter;
