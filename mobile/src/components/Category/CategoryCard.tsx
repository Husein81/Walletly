import { View, Text } from "react-native";

// Local imports
import { NAV_THEME } from "~/lib/constants";
import { getColorByIndex } from "~/lib/functions";
import { iconsRecord } from "~/lib/icons/constants";
import { Icon } from "~/lib/icons/Icon";
import { useColorScheme } from "~/lib/useColorScheme";
import { Category } from "~/types";
import { Dropdown } from "../ui-components";

type Props = {
  category: Category;
};
const CategoryCard = ({ category }: Props) => {
  const { isDarkColorScheme } = useColorScheme();
  const color = getColorByIndex(category.name);

  const options = [
    {
      label: "Edit",
      value: "edit",
      onPress: () => console.log("Edit"),
    },
    {
      label: "Delete",
      value: "delete",
      onPress: () => console.log("Delete"),
    },
  ];

  return (
    <View className="flex-row justify-between items-center gap-4 mb-3">
      <View className="flex-row items-center gap-4">
        <View className="p-2 rounded-lg" style={{ backgroundColor: color }}>
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
    </View>
  );
};
export default CategoryCard;
