import { iconsRecord } from "@/constants";
import { Icon } from "@/components/ui";
import { cn } from "@/lib/utils";
import { FlatList, Pressable, Text, View } from "react-native";
import { Button } from "../ui-components";

type BaseItem = {
  id?: string | number;
  name: string;
  imageUrl?: string | null;
};

type Props<T extends BaseItem> = {
  title: string;
  data: T[];
  numColumns?: number;
  selectedId?: string | number;
  action?: React.ReactNode;
  onSelect: (item: T) => void;
  renderSubtitle?: (item: T) => string | null;
};

export function GridSelector<T extends BaseItem>({
  title,
  data,
  numColumns = 3,
  selectedId,
  action,
  onSelect,
  renderSubtitle,
}: Props<T>) {
  return (
    <View className="flex-1 p-6">
      <View className="flex-row items-center justify-center mb-6">
        <Text className="text-3xl font-bold text-foreground">{title}</Text>
      </View>

      <FlatList
        data={data}
        keyExtractor={(item, idx) => String(item.id ?? idx)}
        numColumns={numColumns}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
        columnWrapperStyle={
          numColumns > 1 ? { justifyContent: "flex-start" } : undefined
        }
        renderItem={({ item, index }) => {
          const isSelected = selectedId !== undefined && item.id === selectedId;

          const subtitle = renderSubtitle ? renderSubtitle(item) : null;

          return (
            <View
              className="px-2 mb-3"
              style={{ width: `${100 / numColumns}%` }}
            >
              <Pressable
                key={item.id ?? index}
                onPress={() => onSelect(item)}
                className={cn(
                  "p-3 rounded-xl items-center justify-center bg-card border",
                  isSelected ? "border-primary bg-primary/10" : "border-border",
                )}
              >
                <View className="p-3 rounded-xl bg-primary/10 mb-2">
                  <Icon
                    name={iconsRecord[item.imageUrl || "Wallet"]}
                    color="#14B8A6"
                    size={22}
                  />
                </View>

                <Text
                  numberOfLines={1}
                  className="text-xs font-semibold text-foreground capitalize text-center"
                >
                  {item.name}
                </Text>

                {!!subtitle && (
                  <Text
                    numberOfLines={1}
                    className="text-xs text-muted-foreground mt-1"
                  >
                    {subtitle}
                  </Text>
                )}

                {isSelected && (
                  <View className="absolute top-2 right-2 bg-primary rounded-full p-1">
                    <Icon name="Check" size={14} color="white" />
                  </View>
                )}
              </Pressable>
            </View>
          );
        }}
        ListFooterComponent={<View className="pt-4">{action}</View>}
      />
    </View>
  );
}
