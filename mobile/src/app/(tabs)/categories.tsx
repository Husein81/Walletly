// Global imports
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect } from "expo-router";
import { useCallback, useMemo } from "react";
import { View, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import CategoryForm from "@/components/Category/CategoryForm";
import CategorySectionList from "@/components/Category/CategorySectionList";
import { Button, Text } from "@/components/ui";
import { ListSkeleton } from "@/components/ui-components";

// Local imports
import { Skeleton } from "@/components/ui/skeleton";
import { formattedBalance } from "@/functions";
import { useGetAccounts } from "@/hooks/accounts";
import { useCategories } from "@/hooks/categories";
import { useColorScheme } from "@/lib/useColorScheme";
import { ExpenseType } from "@/types";

// store imports
import { useAuthStore, useModalStore } from "@/store";

const Categories = () => {
  const { user } = useAuthStore();
  const { onOpen } = useModalStore();
  const { isDarkColorScheme } = useColorScheme();

  const { data: categories, refetch } = useCategories(user?.id || "");
  const { data: accounts } = useGetAccounts(user?.id ?? "");

  const totalBalance = useMemo(
    () => accounts?.reduce((acc, account) => acc + Number(account.balance), 0),
    [accounts]
  );
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
    <SafeAreaView edges={["top"]} className="flex-1 bg-background">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Quick Add Category Card */}
        <View className="px-5 pt-6 pb-2">
          <Pressable onPress={handleOpenCategory}>
            <LinearGradient
              colors={["#8b5cf6", "#7c3aed"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                borderRadius: 20,
                padding: 24,
                shadowColor: "#8b5cf6",
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.3,
                shadowRadius: 16,
                elevation: 8,
              }}
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <Text className="text-white text-xl font-bold mb-1">
                    Create Category
                  </Text>
                  <Text className="text-white/80 text-sm">
                    Organize your expenses and income
                  </Text>
                </View>
                <View className="bg-white/20 p-4 rounded-2xl">
                  <Text className="text-white text-2xl">📁</Text>
                </View>
              </View>
            </LinearGradient>
          </Pressable>
        </View>

        {/* Stats Cards */}
        <View className="px-5 pt-4 pb-2">
          <View className="flex-row gap-3">
            <View className="flex-1 bg-card shadow-md rounded-2xl p-4 border border-border">
              <Text className="text-muted-foreground text-xs font-medium mb-1">
                EXPENSE
              </Text>
              <Text className="text-foreground text-2xl font-bold">
                {expenseCategories?.length || 0}
              </Text>
              <Text className="text-red-500 text-xs mt-1">Categories</Text>
            </View>
            <View className="flex-1 bg-card shadow-md rounded-2xl p-4 border border-border">
              <Text className="text-muted-foreground text-xs font-medium mb-1">
                INCOME
              </Text>
              <Text className="text-foreground text-2xl font-bold">
                {incomeCategories?.length || 0}
              </Text>
              <Text className="text-green-500 text-xs mt-1">Categories</Text>
            </View>
          </View>
        </View>

        {/* Categories Section */}
        <View className="px-5 mt-6">
          <View className="flex-row items-center justify-between mb-4">
            <View>
              <Text className="text-foreground text-2xl font-bold">
                All Categories
              </Text>
              <Text className="text-muted-foreground text-sm mt-1">
                {categories?.length || 0} total categories
              </Text>
            </View>
            <Pressable
              onPress={handleOpenCategory}
              className="bg-primary/10 px-4 py-2 rounded-full active:scale-95"
            >
              <Text className="text-primary text-sm font-semibold">+ Add</Text>
            </Pressable>
          </View>

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
                <Text className="text-7xl">📁</Text>
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
