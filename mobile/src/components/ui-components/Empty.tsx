import { View, Text } from "react-native";
import { Icon } from "~/lib/icons/Icon";
import { useColorScheme } from "~/lib/useColorScheme";

type Props = {
  title?: string;
  description?: string;
  icon?: string;
};
const Empty = ({ title, description, icon }: Props) => {
  const { isDarkColorScheme } = useColorScheme();
  return (
    <View className="flex-1 items-center justify-center gap-4">
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
export default Empty;
