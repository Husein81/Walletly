import { Pressable, Text, View } from "react-native";

// Local imports
import { getColorByIndex } from "@/functions";
import { iconsRecord } from "@/lib/config";
import { Icon } from "@/lib/icons/Icon";
import { Category } from "@/types";
import { Card } from "../ui";
import CategoryForm from "./CategoryForm";

// Store imports
import { useModalStore } from "@/store";
import { useColorScheme } from "@/lib/useColorScheme";
import { LinearGradient } from "expo-linear-gradient";

type Props = {
  category: Category;
};
const CategoryCard = ({ category }: Props) => {
  const { isDarkColorScheme } = useColorScheme();
  const { onOpen } = useModalStore();
  const color = getColorByIndex(category.name);

  const handleEdit = () =>
    onOpen(<CategoryForm category={category} />, "Edit Category");

  return (
    <Pressable onPress={handleEdit}>
      <LinearGradient
        colors={
          isDarkColorScheme
            ? ["#101010", "#18181b", "#27272a"]
            : ["#fafafa", "#f4f4f5", "#e4e4e7"]
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          width: "100%",
          maxWidth: 350,
          borderRadius: 14,
          padding: 18,
          shadowColor: "#000000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.25,
          shadowRadius: 12,
          elevation: 2,
          borderWidth: 1,
          borderColor: isDarkColorScheme
            ? "rgba(63, 63, 70, 0.3)"
            : "rgba(228, 228, 231, 0.8)",
        }}
        className="flex-row items-center gap-4 mb-4"
      >
        {" "}
        <View className="flex-row items-center gap-4 flex-1">
          <View
            className="p-3 rounded-2xl shadow-sm"
            style={{ backgroundColor: color }}
          >
            <Icon
              name={iconsRecord[category.imageUrl || "other"]}
              color="#ffffff"
              size={24}
            />
          </View>
          <View className="flex-1">
            <Text className="text-foreground text-lg font-bold capitalize">
              {category.name}
            </Text>
            <Text className="text-muted-foreground text-sm capitalize">
              {category.type.toLowerCase()}
            </Text>
          </View>
        </View>
      </LinearGradient>
    </Pressable>
  );
};
export default CategoryCard;
