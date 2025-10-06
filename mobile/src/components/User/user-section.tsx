import { View, Text } from "react-native";
import UserCard from "./user-card";

type Card = {
  icon?: string;
  title: string;
  subTitle: string;
  onPress?: () => void;
};
type Props = {
  title: string;
  cards: Card[];
};
const UserSection = ({ title, cards }: Props) => {
  return (
    <View className="px-5 mb-6">
      <Text className="text-muted-foreground text-sm font-semibold uppercase tracking-wider mb-3 px-1">
        {title}
      </Text>
      <View className="bg-card rounded-2xl border border-border/50 overflow-hidden">
        {cards.map((card, index) => (
          <UserCard key={index} {...card} />
        ))}
      </View>
    </View>
  );
};
export default UserSection;
