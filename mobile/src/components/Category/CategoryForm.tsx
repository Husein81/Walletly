import { Field, useForm } from "@tanstack/react-form";
import { useCallback, useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { z } from "zod";
import { useCreateCategory, useUpdateCategory } from "~/hooks/categories";
import { useColorScheme } from "~/lib/useColorScheme";
import { useAuthStore } from "~/store/authStore";
import useModalStore from "~/store/modalStore";
import { Category, ExpenseType } from "~/types";
import { Button, Input, Label } from "../ui";
import { FieldInfo, IconSelector } from "../ui-components";
import { cn } from "~/lib/utils";
import { Icon } from "~/lib/icons/Icon";
import Toast from "react-native-toast-message";

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
  const { isDarkColorScheme } = useColorScheme();

  const [selectedIcon, setSelectedIcon] = useState(category?.imageUrl || "pc");
  const [selectedType, setSelectedType] = useState<ExpenseType>(
    category?.type || ExpenseType.EXPENSE
  );

  const createCategory = useCreateCategory();
  const upgradeCategory = useUpdateCategory();

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

  const isSelectedType = useCallback(
    (type: ExpenseType) => {
      return type === selectedType;
    },
    [selectedType]
  );

  return (
    <View className="gap-8 flex">
      <form.Field
        name="type"
        validators={{ onChange: categorySchema.shape.type }}
        children={(field) => (
          <View className="gap-2 flex-row items-center justify-between ">
            <Label>Type</Label>
            <TouchableOpacity
              className="flex-row items-center gap-2"
              onPress={() => setSelectedType(ExpenseType.EXPENSE)}
            >
              {isSelectedType(ExpenseType.EXPENSE) && (
                <Icon
                  name="Check"
                  color={isDarkColorScheme ? "white" : "black"}
                />
              )}
              <Text
                className={cn(
                  "text-primary text-lg",
                  isSelectedType(ExpenseType.EXPENSE) && "font-bold text-xl"
                )}
              >
                Expense
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-row items-center gap-2"
              onPress={() => setSelectedType(ExpenseType.INCOME)}
            >
              {isSelectedType(ExpenseType.INCOME) && (
                <Icon
                  name="Check"
                  color={isDarkColorScheme ? "white" : "black"}
                />
              )}

              <Text
                className={cn(
                  "text-primary text-lg",
                  isSelectedType(ExpenseType.INCOME) && "font-bold text-xl"
                )}
              >
                Income
              </Text>
            </TouchableOpacity>
            <FieldInfo field={field} />
          </View>
        )}
      />

      <form.Field
        name="name"
        validators={{ onChange: categorySchema.shape.name }}
        children={(field) => (
          <View className="gap-2">
            <Label>Name</Label>
            <Input
              value={field.state.value}
              onChangeText={field.handleChange}
              placeholder="Category name"
              autoCapitalize="none"
            />
            <FieldInfo field={field} />
          </View>
        )}
      />

      <View className="gap-2 ">
        <Label>Icon</Label>
        <IconSelector
          selectedIcon={selectedIcon}
          setSelectedIcon={setSelectedIcon}
        />
      </View>

      <View className="flex-row gap-4">
        <Button
          variant={"outline"}
          className="border-primary border"
          onPress={onClose}
        >
          <Text className="text-primary">Cancel</Text>
        </Button>
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <Button
              disabled={!canSubmit}
              onPress={(e) => {
                e.preventDefault();
                form.handleSubmit();
              }}
            >
              {isSubmitting ? (
                <ActivityIndicator
                  color={isDarkColorScheme ? "black" : "white"}
                />
              ) : (
                <Text className="text-secondary font-semibold">Save</Text>
              )}
            </Button>
          )}
        />
      </View>
    </View>
  );
};
export default CategoryForm;
