import { Text, View } from "react-native";

// Local imports
import { useDeleteCategory } from "~/hooks/categories";
import { NAV_THEME, iconsRecord } from "~/lib/config";
import { getColorByIndex } from "~/lib/functions";
import { Icon } from "~/lib/icons/Icon";
import { useColorScheme } from "~/lib/useColorScheme";
import useModalStore from "~/store/modalStore";
import { Category } from "~/types";
import { Card } from "../ui";
import { Dropdown } from "../ui-components";
import CategoryForm from "./CategoryForm";

type Props = {
  category: Category;
};
const CategoryCard = ({ category }: Props) => {
  const { onOpen } = useModalStore();
  const { isDarkColorScheme } = useColorScheme();
  const color = getColorByIndex(category.name);

  const deleteCategory = useDeleteCategory(category?.id ?? "");

  const handleDelete = async () => await deleteCategory.mutateAsync();
  const handleEdit = () =>
    onOpen(<CategoryForm category={category} />, "Edit Category");
  const options = [
    {
      label: "Edit",
      value: "edit",
      onPress: handleEdit,
    },
    {
      label: "Delete",
      value: "delete",
      onPress: handleDelete,
    },
  ];

  return (
    <Card className="flex-row py-2 px-3 rounded-xl justify-between items-center gap-4 mb-3">
      <View className="flex-row items-center gap-4">
        <View className="p-2 rounded-xl" style={{ backgroundColor: color }}>
          <Icon
            name={iconsRecord[category.imageUrl || "other"]}
            color={
              isDarkColorScheme
                ? NAV_THEME.dark.primary
                : NAV_THEME.light.primary
            }
            size={32}
          />
        </View>
        <Text className="text-primary text-xl capitalize">{category.name}</Text>
      </View>
      <Dropdown icon="Ellipsis" options={options} />
    </Card>
  );
};
export default CategoryCard;
