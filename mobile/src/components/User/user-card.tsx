import { Icon } from "@/lib/icons/Icon";
import { View, Text, Pressable } from "react-native";

type Props = {
  icon?: string;
  title: string;
  subTitle: string;
  onPress?: () => void;
};

const UserCard = ({ icon, title, subTitle, onPress }: Props) => {
  return (
    <Pressable onPress={onPress} className="active:bg-muted/50">
      <View className="flex-row items-center p-4 border-b border-border/30">
        {icon && (
          <View className="bg-primary/10 p-2.5 rounded-xl mr-4">
            <Icon name={icon} size={20} color="#14B8A6" />
          </View>
        )}
        <View className="flex-1">
          <Text className="text-foreground text-base font-semibold mb-0.5">
            {title}
          </Text>
          <Text className="text-muted-foreground text-sm">{subTitle}</Text>
        </View>
        <Icon name="ChevronRight" size={20} color="#a1a1aa" />
      </View>
    </Pressable>
  );
};
export default UserCard;
