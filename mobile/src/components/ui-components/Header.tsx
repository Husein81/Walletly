import { View } from "react-native";

// Local imports
import { Text } from "../ui/text";

type Props = {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  hasGreeting?: boolean;
};

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 18) return "Good Afternoon";
  return "Good Evening";
};

export const Header = ({
  title,
  subtitle,
  action,
  hasGreeting = false,
}: Props) => {
  return (
    <View className=" pt-4 pb-3 flex-row justify-between items-center">
      {/* User Info with Gradient Accent */}
      <View className="flex-1">
        {hasGreeting && (
          <View className="flex-row items-center gap-2 mb-2">
            <Text className="text-xs text-muted-foreground">
              {getGreeting()}
            </Text>
          </View>
        )}
        <Text className="text-foreground capitalize text-3xl font-bold tracking-tight">
          {title}
        </Text>
        {subtitle && (
          <Text className="text-muted-foreground text-sm mt-1">{subtitle}</Text>
        )}
      </View>

      {/* Action Buttons */}
      {action && <View className="ml-4">{action}</View>}
    </View>
  );
};
