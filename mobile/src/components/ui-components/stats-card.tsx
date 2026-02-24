import { Icon } from "@/components/ui";
import { cn } from "@/lib/utils";
import { View, Text } from "react-native";

type Props = {
  title: string;
  value: number | string;
  icon?: string;
  iconColor?: string;
  subTitle?: string;
  subTitleColor?: string;
};
const StatsCard = ({
  title,
  value,
  icon,
  iconColor,
  subTitle,
  subTitleColor,
}: Props) => {
  return (
    <View className="flex-1 bg-card shadow-md rounded-2xl p-4 border border-border">
      <View className="flex-row justify-between items-center">
        <Text className="text-muted-foreground text-xs font-medium mb-1">
          {title}
        </Text>
        {icon && (
          <View
            style={{ opacity: 0.45, backgroundColor: iconColor }}
            className="p-2 rounded-full"
          >
            <Icon name={icon} size={14} color={iconColor} />
          </View>
        )}
      </View>
      <Text className="text-foreground text-2xl font-bold">{value}</Text>
      {subTitle && (
        <Text className={cn("text-xs mt-1", subTitleColor)}>{subTitle}</Text>
      )}
    </View>
  );
};
export default StatsCard;
