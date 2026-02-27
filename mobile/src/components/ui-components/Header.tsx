import { Pressable, TouchableOpacity, View } from "react-native";

// Local imports
import { Text } from "../ui/text";
import { Icon } from "@/components/ui";
import { getGreeting } from "@/utils";
import { router } from "expo-router";

type Props = {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  canGoBack?: boolean;
  hasGreeting?: boolean;
};

export const Header = ({
  title,
  subtitle,
  action,
  canGoBack,
  hasGreeting = false,
}: Props) => {
  const { greeting, icon } = getGreeting();
  return (
    <View className="pt-4 pb-3 flex-row justify-between items-center">
      {/* User Info with Gradient Accent */}
      <View className="flex-1">
        {hasGreeting && (
          <View className="flex-row items-center gap-2 mb-2 rounded-lg py-1">
            <Text className="text-xs text-muted-foreground">{greeting}</Text>
            <Icon name={icon} size={14} color="#fbbf24" />
          </View>
        )}
        {canGoBack ? (
          <View className="flex-row items-center justify-between px-4 pb-4 border-b border-border">
            <TouchableOpacity onPress={() => router.back()} className="p-2">
              <Icon name="ChevronLeft" size={24} color="#9ca3af" />
            </TouchableOpacity>
            <Text className="text-xl font-bold text-foreground">{title}</Text>
            <View className="w-10" />
          </View>
        ) : (
          <Text className="text-foreground capitalize text-2xl font-bold tracking-tight">
            {title}
          </Text>
        )}
        {subtitle && (
          <Text className="text-muted-foreground text-sm mt-1">{subtitle}</Text>
        )}
      </View>

      {/* Action Buttons */}
      {action && <View className="ml-4">{action}</View>}
    </View>
  );
};
