import { Icon } from "@/lib/icons/Icon";
import { View, Text, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
type Props = {
  onPress: () => void;
};

const AddTransactionSection = ({ onPress }: Props) => {
  return (
    <Pressable onPress={onPress} className="active:scale-[0.98] mb-6 shadow-x;">
      <LinearGradient
        colors={["#3b82f6", "#2563eb"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          borderRadius: 20,
          padding: 20,
          shadowColor: "#3b82f6",
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.3,
          shadowRadius: 16,
          elevation: 8,
        }}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-1">
            <Text className="text-white text-xl font-bold mb-1">
              Add Transaction
            </Text>
            <Text className="text-white/80 text-sm">
              Track your income, expenses, or transfers
            </Text>
          </View>
          <View className="bg-white/20 p-3 rounded-full">
            <Icon name="Plus" size={28} color="#ffffff" strokeWidth={2.5} />
          </View>
        </View>

        {/* Quick Action Pills */}
        <View className="flex-row gap-2 mt-4">
          <View className="bg-white/20 px-3 py-1.5 rounded-full flex-row items-center gap-1.5">
            <Icon
              name="TrendingDown"
              size={14}
              color="#ffffff"
              strokeWidth={2}
            />
            <Text className="text-white text-xs font-medium">Expense</Text>
          </View>
          <View className="bg-white/20 px-3 py-1.5 rounded-full flex-row items-center gap-1.5">
            <Icon name="TrendingUp" size={14} color="#ffffff" strokeWidth={2} />
            <Text className="text-white text-xs font-medium">Income</Text>
          </View>
          <View className="bg-white/20 px-3 py-1.5 rounded-full flex-row items-center gap-1.5">
            <Icon
              name="ArrowLeftRight"
              size={14}
              color="#ffffff"
              strokeWidth={2}
            />
            <Text className="text-white text-xs font-medium">Transfer</Text>
          </View>
        </View>
      </LinearGradient>
    </Pressable>
  );
};
export default AddTransactionSection;
