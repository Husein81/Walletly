// Global imports
import { useForm } from "@tanstack/react-form";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { ActivityIndicator, Alert, Pressable, Text, View } from "react-native";
import Toast from "react-native-toast-message";
import { z } from "zod";

// Local imports
import {
  useCreateCategory,
  useDeleteCategory,
  useUpdateCategory,
} from "@/hooks/categories";
import { Icon } from "@/components/ui";
import { cn } from "@/lib/utils";
import { Category, ExpenseType } from "@/types";
import { Button, Label } from "../ui";
import { FieldInfo, IconSelector, InputField } from "../ui-components";

// Store imports
import { useAuthStore, useModalStore } from "@/store";

type Props = {
  category?: Category;
};

const categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  imageUrl: z.string().min(1, "Image URL is required"),
  type: z.enum([ExpenseType.EXPENSE, ExpenseType.INCOME]),
});

const CategoryForm = ({ category }: Props) => {
  const { user } = useAuthStore();
  const { onClose } = useModalStore();

  const [selectedIcon, setSelectedIcon] = useState(category?.imageUrl || "pc");
  const [selectedType, setSelectedType] = useState<ExpenseType>(
    category?.type || ExpenseType.EXPENSE,
  );

  const createCategory = useCreateCategory();
  const upgradeCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const handleDelete = () => {
    Alert.alert(
      "Delete Category",
      "Are you sure you want to delete this category? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteCategory.mutateAsync(category?.id ?? "");
              onClose();
            } catch (error) {
              Toast.show({
                type: "error",
                text1: "Error deleting category",
                text2: (error as Error)?.message,
              });
            }
          },
        },
      ],
    );
  };

  const form = useForm({
    defaultValues: {
      name: category?.name || "",
      imageUrl: category?.imageUrl || "",
      type: category?.type || selectedType,
    },

    onSubmit: async ({ value }) => {
      try {
        if (category) {
          const payload: Category = {
            ...value,
            imageUrl: selectedIcon,
            id: category.id,
            userId: category.userId,
            createdAt: category.createdAt,
            updatedAt: new Date(),
            type: selectedType,
          };
          await upgradeCategory.mutateAsync(payload);
        } else {
          const payload: Category = {
            ...value,
            imageUrl: selectedIcon,
            userId: user?.id || "",
            createdAt: new Date(),
            updatedAt: new Date(),
            type: selectedType,
          };
          await createCategory.mutateAsync(payload);
        }
      } catch (error) {
        Toast.show({
          type: "error",
          text1: "Category error:",
          text2: (error as Error)?.message,
        });
      }
      onClose();
    },
  });

  return (
    <View className="gap-4 flex pt-4">
      {/* Type Selection - Modern Toggle */}
      <form.Field
        name="type"
        validators={{ onChange: categorySchema.shape.type }}
        children={(field) => (
          <View className="gap-3">
            <Label className="text-foreground text-base font-semibold">
              Category Type
            </Label>
            <View className="flex-row gap-3 px-2">
              <Pressable
                onPress={() => setSelectedType(ExpenseType.EXPENSE)}
                className="flex-1 active:scale-95"
              >
                <View
                  className={cn(
                    "p-4 rounded-2xl border-2 flex-row items-center justify-center gap-2",
                    selectedType === ExpenseType.EXPENSE
                      ? "bg-red-500/10 border-red-500"
                      : "bg-card border-border",
                  )}
                >
                  <Icon
                    name="TrendingDown"
                    size={20}
                    color={
                      selectedType === ExpenseType.EXPENSE
                        ? "#ef4444"
                        : "#a1a1aa"
                    }
                  />
                  <Text
                    className={cn(
                      "text-base font-semibold",
                      selectedType === ExpenseType.EXPENSE
                        ? "text-red-500"
                        : "text-muted-foreground",
                    )}
                  >
                    Expense
                  </Text>
                  {selectedType === ExpenseType.EXPENSE && (
                    <View className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1">
                      <Icon name="Check" size={12} color="white" />
                    </View>
                  )}
                </View>
              </Pressable>

              <Pressable
                onPress={() => setSelectedType(ExpenseType.INCOME)}
                className="flex-1 active:scale-95"
              >
                <View
                  className={cn(
                    "p-4 rounded-2xl border-2 flex-row items-center justify-center gap-2",
                    selectedType === ExpenseType.INCOME
                      ? "bg-primary/10 border-primary"
                      : "bg-card border-border",
                  )}
                >
                  <Icon
                    name="TrendingUp"
                    size={20}
                    color={
                      selectedType === ExpenseType.INCOME
                        ? "#14b8a6"
                        : "#a1a1aa"
                    }
                  />
                  <Text
                    className={cn(
                      "text-base font-semibold",
                      selectedType === ExpenseType.INCOME
                        ? "text-primary"
                        : "text-muted-foreground",
                    )}
                  >
                    Income
                  </Text>
                  {selectedType === ExpenseType.INCOME && (
                    <View className="absolute -top-2 -right-2 bg-primary rounded-full p-1">
                      <Icon name="Check" size={12} color="white" />
                    </View>
                  )}
                </View>
              </Pressable>
            </View>
            <FieldInfo field={field} />
          </View>
        )}
      />
      {/* Category Name Input */}
      <form.Field
        name="name"
        validators={{ onChange: categorySchema.shape.name }}
        children={(field) => (
          <InputField
            placeholder="e.g., Food, Salary"
            label="Category Name *"
            icon="Tag"
            field={field}
          />
        )}
      />

      {/* Icon Selection */}
      <View className="gap-3">
        <Label className="text-foreground text-base font-semibold">
          Choose Icon
        </Label>
        <IconSelector
          selectedIcon={selectedIcon}
          setSelectedIcon={setSelectedIcon}
        />
        <Text className="text-muted-foreground text-xs">
          Select an icon that represents this category
        </Text>
      </View>

      {/* Action Buttons */}
      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting]}
      >
        {([canSubmit, isSubmitting]) => (
          <View className="gap-3 pt-2">
            <Pressable
              disabled={!canSubmit || isSubmitting}
              onPress={(e) => {
                e.preventDefault();
                form.handleSubmit();
              }}
              className="active:scale-95"
            >
              <LinearGradient
                colors={
                  selectedType === ExpenseType.EXPENSE
                    ? ["#ef4444", "#dc2626"]
                    : ["#14b8a6", "#0d9488"]
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  borderRadius: 16,
                  paddingVertical: 16,
                  opacity: !canSubmit || isSubmitting ? 0.5 : 1,
                }}
              >
                <View className="flex-row items-center justify-center gap-2">
                  {isSubmitting ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <>
                      <Text className="text-white text-base font-semibold">
                        {category ? "Update" : "Save"}
                      </Text>
                    </>
                  )}
                </View>
              </LinearGradient>
            </Pressable>

            {category && (
              <Pressable onPress={handleDelete} className="active:scale-95">
                <View className="bg-destructive/10 rounded-2xl py-4 border border-destructive/30 flex-row items-center justify-center gap-2">
                  <Icon name="Trash2" size={20} color="#ef4444" />
                  <Text className="text-destructive text-base font-semibold">
                    Delete Category
                  </Text>
                </View>
              </Pressable>
            )}
          </View>
        )}
      </form.Subscribe>
    </View>
  );
};
export default CategoryForm;
