import { View, Text } from "react-native";
import { Icon } from "~/lib/icons/Icon";

type Props = {
  title?: string;
  description?: string;
  icon?: string;
};
const Empty = ({ title, description, icon }: Props) => {
  return (
    <View className="flex-1 items-center justify-center gap-4">
      {icon && <Icon name={icon} size={32} />}
      <Text>{title || "No Title"}</Text>
      <Text>{description || "No Description"}</Text>
    </View>
  );
};
export default Empty;
