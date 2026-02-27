import { Pressable, Text, View } from "react-native";

// Local imports
import { iconsRecord } from "@/constants";
import { Icon } from "@/components/ui";
import { Category } from "@/types";
import CategoryForm from "./CategoryForm";
import { Rn } from "../ui";

// Store imports
import { useModalStore } from "@/store";
import { useThemeStore } from "@/store/themStore";

type Props = {
  category: Category;
};

const CategoryCard = ({ category }: Props) => {
  const { onOpen } = useModalStore();
  const { isDark } = useThemeStore();

  const handleEdit = () =>
    onOpen(<CategoryForm category={category} />, "Edit Category");

  return (
    <Pressable onPress={handleEdit}>
      <Rn.Card className="p-4 items-center shadow-none justify-center rounded-2xl bg-white/10">
        <View className="mb-3 bg-primary/10 rounded-full p-3">
          <Icon
            name={iconsRecord[category.imageUrl || "other"]}
            color={"#14b8ae"}
            size={32}
          />
        </View>
        <Text className="text-foreground text-sm font-bold capitalize text-center mb-1">
          {category.name}
        </Text>
      </Rn.Card>
    </Pressable>
  );
};

export default CategoryCard;
