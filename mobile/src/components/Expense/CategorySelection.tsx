import { iconsRecord } from "@/lib/config";
import { Icon } from "@/components/ui";
import { cn } from "@/lib/utils";
import { Account, Category } from "@/types";
import { Pressable, ScrollView, Text, View } from "react-native";

type Props = {
  title: string;
  data: Account[] | Category[];
  isAccountType: boolean;
  selectedAccount?: Account;
  selectedToAccount?: Account;
  selectedCategory?: Category;
  target?: "from" | "to";
  onSelect: (item: Account | Category) => void;
};

const CategorySelection = ({
  title,
  data,
  isAccountType,
  selectedAccount,
  selectedToAccount,
  selectedCategory,
  target,
  onSelect,
}: Props) => {
  return (
    <View className="flex-1 p-6">
      <View className="flex-row items-center justify-center mb-6">
        <Text className="text-3xl font-bold text-foreground">{title}</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {data.map((item: Account | Category, index: number) => {
          const isSelectedItem = isAccountType
            ? target === "from"
              ? selectedAccount?.id === item.id
              : selectedToAccount?.id === item.id
            : selectedCategory?.id === item.id;

          return (
            <Pressable
              key={item.id ?? index}
              onPress={() => onSelect(item)}
              className={cn(
                "mb-3 p-4 rounded-xl flex-row items-center justify-between bg-card border",
                isSelectedItem
                  ? "border-primary bg-primary/10"
                  : "border-border",
              )}
            >
              <View className="flex-row items-center gap-3">
                <View className="p-3 rounded-xl bg-primary/10">
                  <Icon
                    name={iconsRecord[item.imageUrl || "Wallet"]}
                    color="#14B8A6"
                    size={24}
                  />
                </View>
                <View>
                  <Text className="text-base font-semibold text-foreground capitalize">
                    {item.name}
                  </Text>
                  {isAccountType && (item as Account).balance !== undefined && (
                    <Text className="text-sm text-muted-foreground">
                      Balance: ${Number((item as Account).balance).toFixed(2)}
                    </Text>
                  )}
                </View>
              </View>
              {isSelectedItem && (
                <View className="bg-primary rounded-full p-1">
                  <Icon name="Check" size={16} color="white" />
                </View>
              )}
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
};
export default CategorySelection;
