// Global imports
import { useFocusEffect } from "expo-router";
import { useCallback, useMemo } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import CategoryForm from "~/components/Category/CategoryForm";
import CategorySectionList from "~/components/Category/CategorySectionList";
import { Button, Text } from "~/components/ui";
import { Empty, ListSkeleton } from "~/components/ui-components";

// Local imports
import { useCategories } from "~/hooks/categories";
import { useColorScheme } from "~/lib/useColorScheme";
import { ExpenseType } from "~/types";

// store imports
import { useAuthStore } from "~/store/authStore";
import useModalStore from "~/store/modalStore";

const Categories = () => {
  const { user } = useAuthStore();
  const { onOpen } = useModalStore();
  const { isDarkColorScheme } = useColorScheme();

  const { data: categories, refetch } = useCategories(user?.id || "");

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [categories])
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
    <SafeAreaView edges={["top"]} className="px-6 pt-6 flex-1">
      <View className="flex-1">
        {categories && categories.length > 0 ? (
          <CategorySectionList categorySections={categorySections} />
        ) : categories && categories.length === 0 ? (
          <Empty
            title="No categories found"
            description="Add your first category to get started"
            icon="Info"
          />
        ) : (
          <ListSkeleton />
        )}
      </View>

      <Button className="rounded-xl mb-4" onPress={handleOpenCategory}>
        <Text className="text-secondary uppercase font-semibold">
          add new category
        </Text>
      </Button>
    </SafeAreaView>
  );
};
export default Categories;
