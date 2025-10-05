import { View, Text } from "react-native";
import { Icon } from "@/lib/icons/Icon";
import { useColorScheme } from "@/lib/useColorScheme";
import { cn } from "@/lib/utils";

type Props = {
  title?: string;
  description?: string;
  icon?: string;
  className?: string;
};

export const Empty = ({ title, description, icon, className }: Props) => {
  const { isDarkColorScheme } = useColorScheme();
  return (
    <View className={cn("flex-1 items-center justify-center gap-4", className)}>
      {icon && (
        <Icon
          name={icon}
          size={32}
          color={isDarkColorScheme ? "white" : "black"}
        />
      )}
      <Text className="text-lg font-semibold text-primary">
        {title || "No Title"}
      </Text>
      <Text className="text-sm text-iron">
        {description || "No Description"}
      </Text>
    </View>
  );
};
