// Global imports
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect } from "expo-router";
import { useCallback, useMemo } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import CategoryForm from "@/components/Category/CategoryForm";
import CategorySectionList from "@/components/Category/CategorySectionList";
import { Text } from "@/components/ui";
import { ListSkeleton } from "@/components/ui-components";

// Local imports
import { useCategories } from "@/hooks/categories";
import { ExpenseType } from "@/types";

// store imports
import { Icon } from "@/components/ui";
import { Header } from "@/components/ui-components/Header";
import { THEME } from "@/lib/theme";
import { useAuthStore, useModalStore } from "@/store";
import { useThemeStore } from "@/store/themStore";

const Categories = () => {
  const { user } = useAuthStore();
  const { onOpen } = useModalStore();
  const { isDark } = useThemeStore();

  const { data: categories, refetch } = useCategories(user?.id || "");

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch, categories]),
  );

  const expenseCategories = useMemo(
    () =>
      categories?.filter((category) => category.type === ExpenseType.EXPENSE),
    [categories],
  );

  const incomeCategories = useMemo(
    () =>
      categories?.filter((category) => category.type === ExpenseType.INCOME),
    [categories],
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

  const backgroundColor = isDark
    ? THEME.dark.background
    : THEME.light.background;

  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor }}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Categories Section */}
        <View className="px-5 mt-4">
          <Header
            title="Categories"
            subtitle={`${categories?.length || 0} total categories`}
            action={
              <Pressable
                onPress={handleOpenCategory}
                className="bg-primary/85 px-4 py-2 rounded-full active:scale-95"
              >
                <Text className="text-white text-sm font-semibold">+ Add</Text>
              </Pressable>
            }
          />

          {categories && categories.length > 0 ? (
            <CategorySectionList categorySections={categorySections} />
          ) : categories && categories.length === 0 ? (
            <View className="items-center py-16">
              <LinearGradient
                colors={["#f3e8ff", "#e9d5ff"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  borderRadius: 100,
                  padding: 32,
                  marginBottom: 16,
                }}
              >
                <Icon name="FolderOpen" size={48} color="#9ca3af" />
              </LinearGradient>
              <Text className="text-foreground text-xl font-bold mb-2">
                No Categories Yet
              </Text>
              <Text className="text-muted-foreground text-center px-8 mb-8">
                Create categories to organize your expenses and income
              </Text>
              <Pressable
                onPress={handleOpenCategory}
                className="active:scale-95"
              >
                <LinearGradient
                  colors={["#8b5cf6", "#7c3aed"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{
                    borderRadius: 16,
                    paddingVertical: 14,
                    paddingHorizontal: 32,
                  }}
                >
                  <Text className="text-white text-base font-semibold">
                    Create Your First Category
                  </Text>
                </LinearGradient>
              </Pressable>
            </View>
          ) : (
            <ListSkeleton />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
export default Categories;
