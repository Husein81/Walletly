// Global imports
import { useFocusEffect } from "expo-router";
import { useCallback, useMemo } from "react";
import { Text, View } from "react-native";
import CategoryForm from "~/components/Category/CategoryForm";
import CategorySectionList from "~/components/Category/CategorySectionList";
import { Button } from "~/components/ui";
import ListSkeleton from "~/components/ui-components/ListSkeleton";

// Local imports
import { useCategories } from "~/hooks/categories";
import { NAV_THEME } from "~/lib/constants";
import { Icon } from "~/lib/icons/Icon";
import { useColorScheme } from "~/lib/useColorScheme";
import { useAuthStore } from "~/store/authStore";
import useModalStore from "~/store/modalStore";
import { ExpenseType } from "~/types";

const Categories = () => {
  const { user } = useAuthStore();
  const { onOpen } = useModalStore();
  const { isDarkColorScheme } = useColorScheme();

  const { data: categories, refetch } = useCategories(user?.id || "");

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [categories, refetch])
  );
  const expenseCategories = useMemo(
    () =>
      categories?.filter((category) => category.type === ExpenseType.EXPENSE),
    [categories]
  );

  const incomeCategories = useMemo(
    () =>
      categories?.filter((category) => category.type === ExpenseType.INCOME),
    [categories]
  );

  const categorySections = [
    {
      title: "Expense Categories",
      data: expenseCategories || [],
    },
    {
      title: "Income Categories",
      data: incomeCategories || [],
    },
  ];

  const handleOpenCategory = () => onOpen(<CategoryForm />, "Add new Category");
  return (
    <View className="py-4 px-6 flex-1 ">
      <View className="flex-1">
        {categories ? (
          <CategorySectionList categorySections={categorySections} />
        ) : (
          <ListSkeleton />
        )}
      </View>

      <View className="">
        <Button
          variant={"outline"}
          className="flex-row gap-4 border-primary w-fit "
          onPress={handleOpenCategory}
        >
          <Icon
            name="Plus"
            size={20}
            color={isDarkColorScheme ? "white" : "black"}
            className="border rounded-full border-primary"
          />
          <Text className="text-primary uppercase">add new category</Text>
        </Button>
      </View>
    </View>
  );
};
export default Categories;
