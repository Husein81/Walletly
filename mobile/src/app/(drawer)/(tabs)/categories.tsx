// Global imports
import { useEffect, useMemo } from "react";
import { FlatList, SectionList, Text, View } from "react-native";
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

  useEffect(() => {
    refetch();
  }, [categories, user]);

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
    <View className="px-8 flex-1 ">
      {expenseCategories && incomeCategories ? (
        <SectionList
          sections={categorySections}
          keyExtractor={(item) => item.id || Math.random().toString()}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          renderSectionHeader={({ section: { title } }) => (
            <View className="first:my-4 mb-8 mt-20">
              <Text className="text-2xl font-bold text-primary">{title}</Text>
              <View className="w-full mx-auto h-px bg-primary my-4" />
            </View>
          )}
          renderItem={({ item }) => {
            const color = getColorByIndex(item.name);
            return (
              <View className="flex-row items-center gap-4 mb-3">
                <View
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: color }}
                >
                  <Icon
                    name={iconsRecord[item.imageUrl || "other"]}
                    color={
                      isDarkColorScheme
                        ? NAV_THEME.light.primary
                        : NAV_THEME.dark.primary
                    }
                    size={32}
                  />
                </View>
                <Text className="text-primary text-xl">{item.name}</Text>
              </View>
            );
          }}
        />
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
