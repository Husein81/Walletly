// Global imports
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useMemo } from "react";
import { FlatList, SectionList, Text, View } from "react-native";
import CategorySectionList from "~/components/Category/CategorySectionList";
import ListSkeleton from "~/components/ui-components/ListSkeleton";

// Local imports
import { useCategories } from "~/hooks/categories";
import { NAV_THEME } from "~/lib/constants";
import { getColorByIndex } from "~/lib/functions";
import { iconsRecord } from "~/lib/icons/constants";
import { Icon } from "~/lib/icons/Icon";
import { useColorScheme } from "~/lib/useColorScheme";
import { cn } from "~/lib/utils";
import { useAuthStore } from "~/store/authStore";

const Categories = () => {
  const { user } = useAuthStore();
  const { isDarkColorScheme } = useColorScheme();

  const { data: categories, refetch } = useCategories(user?.id ?? "");

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [categories, user])
  );

  const expenseCategories = useMemo(
    () => categories?.filter((category) => category.type === "EXPENSE"),
    [categories]
  );

  const incomeCategories = useMemo(
    () => categories?.filter((category) => category.type === "INCOME"),
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

  return (
    <View className="p-8 flex-1 ">
      {categories ? (
        <CategorySectionList categorySections={categorySections} />
      ) : (
        <ListSkeleton />
      )}

      <View className="p-4 rounded-full shadow-lg absolute bottom-6 right-4 bg-primary">
        <Icon
          name="Plus"
          color={
            isDarkColorScheme ? NAV_THEME.light.primary : NAV_THEME.dark.primary
          }
        />
      </View>
    </View>
  );
};
export default Categories;
