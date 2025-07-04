// Global Imports
import DateTimePicker from "@react-native-community/datetimepicker";
import { useForm } from "@tanstack/react-form";
import { useCallback, useMemo, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

// Local Imports
import { AlertDialog, Card, Input, Label, Textarea } from "~/components/ui";
import { Button, FieldInfo } from "~/components/ui-components";
import BottomSheet, {
  BottomSheetRef,
} from "~/components/ui-components/BottomSheet";
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { getColorByIndex } from "~/functions";
import { useGetAccounts } from "~/hooks/accounts";
import { useCategories } from "~/hooks/categories";
import {
  useCreateExpense,
  useDeleteExpense,
  useUpdateExpense,
} from "~/hooks/expense";
import { iconsRecord, NAV_THEME } from "~/lib/config";
import { Icon } from "~/lib/icons/Icon";
import { useColorScheme } from "~/lib/useColorScheme";
import { cn } from "~/lib/utils";
import { Account, Category, Expense, ExpenseType } from "~/types";

// store imports
import { useAuthStore, useModalStore } from "~/store";

type Props = {
  expense?: Expense;
};

enum BottomSheetType {
  ACCOUNT = "ACCOUNT",
  CATEGORY = "CATEGORY",
}

export const ExpenseForm = ({ expense }: Props) => {
  const { user } = useAuthStore();
  const { onClose } = useModalStore();
  const { isDarkColorScheme } = useColorScheme();

  // Fetch accounts and categories
  const { data: accounts } = useGetAccounts(user?.id || "");
  const { data: categories } = useCategories(user?.id || "");

  const bottomSheetRef = useRef<BottomSheetRef>(null);

  const [selectedExpenseType, setSelectedExpenseType] = useState<ExpenseType>(
    expense?.type || ExpenseType.EXPENSE
  );
  const [accountSelectionTarget, setAccountSelectionTarget] = useState<
    "from" | "to"
  >("from");
  const [selectedAccount, setSelectedAccount] = useState<Account | undefined>(
    expense?.fromAccount || undefined
  );
  const [selectedToAccount, setSelectedToAccount] = useState<
    Account | undefined
  >(expense?.toAccount || undefined);
  const [selectedCategory, setSelectedCategory] = useState<
    Category | undefined
  >(expense?.category || undefined);
  const [bottomSheetType, setBottomSheetType] =
    useState<BottomSheetType | null>(null);

  const [mode, setMode] = useState<"date" | "time">("date");
  const [showDatePicker, setShowDatePicker] = useState(false);

  // expense types
  const expenseTypes = [
    { label: "Income", value: ExpenseType.INCOME },
    { label: "Expense", value: ExpenseType.EXPENSE },
    { label: "Transfer", value: ExpenseType.TRANSFER },
  ];

  const isSelected = (type: ExpenseType) => selectedExpenseType === type;
  const isTransfer = selectedExpenseType === ExpenseType.TRANSFER;

  const filteredCategories = useMemo(() => {
    if (!categories) return [];
    return categories.filter((cat) => cat.type === selectedExpenseType);
  }, [categories, selectedExpenseType]);

  const handleExpenseTypePress = useCallback(
    (type: ExpenseType) => {
      if (type !== selectedExpenseType) {
        setSelectedCategory(undefined);
        setSelectedExpenseType(type);
      }
    },
    [selectedExpenseType]
  );

  const openBottomSheet = (type: BottomSheetType, target?: "from" | "to") => {
    setBottomSheetType(type);
    if (target) {
      setAccountSelectionTarget(target);
    }
    bottomSheetRef.current?.present();
  };

  // Create and Update Expense
  const createExpense = useCreateExpense();
  const updateExpense = useUpdateExpense();

  // Delete Expense
  const deleteExpense = useDeleteExpense();

  const form = useForm({
    defaultValues: {
      type: expense?.type || selectedExpenseType,
      category: expense?.category || selectedCategory || undefined,
      fromAccount: expense?.fromAccount || selectedAccount || undefined,
      toAccount: expense?.toAccount || selectedToAccount || undefined,
      amount: expense?.amount || "",
      description: expense?.description || "",
      updatedAt: expense?.updatedAt || new Date(),
    },
    onSubmit: async ({ value }) => {
      if (!selectedAccount?.id) {
        Toast.show({
          type: "error",
          text1: "Expense error:",
          text2: "Please select an account.",
        });
        return;
      }
      const payload: Expense = {
        ...value,
        userId: user?.id || "",
        type: selectedExpenseType,
        updatedAt: value.updatedAt,
        fromAccountId: selectedAccount?.id,
        fromAccount: selectedAccount,
        toAccountId: selectedToAccount?.id,
        toAccount: selectedToAccount,
        categoryId: selectedCategory?.id,
        category: selectedCategory,
        amount:
          selectedExpenseType === ExpenseType.EXPENSE
            ? -Math.abs(Number(value.amount))
            : Math.abs(Number(value.amount)),
        description: value.description,
      };
      try {
        if (expense) {
          await updateExpense.mutateAsync({
            ...payload,
            id: expense.id,
          });
        } else {
          await createExpense.mutateAsync(payload);
        }
        Toast.show({
          type: "success",
          text1: "Expense saved successfully",
        });
      } catch (error) {
        Toast.show({
          type: "error",
          text1: "Expense error:",
          text2: (error as Error)?.message,
        });
      } finally {
        onClose();
      }
    },
  });

  const handleDeleteExpense = async (expenseId: string) => {
    try {
      await deleteExpense.mutateAsync(expenseId);
      Toast.show({
        type: "success",
        text1: "Expense deleted successfully",
      });
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Expense error:",
        text2: (error as Error)?.message,
      });
    } finally {
      onClose();
    }
  };

  return (
    <View className="flex-1 mt-4">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
        keyboardVerticalOffset={100}
        style={{ flex: 1 }}
      >
        {/* Expense Type Selection */}
        <View className="flex-row gap-4 justify-center items-center mb-8">
          {expenseTypes.map((expenseType, index) => (
            <View key={expenseType.value} className="flex-row gap-2">
              <TouchableOpacity
                className="flex-row gap-2 items-center justify-center mr-2"
                onPress={() => handleExpenseTypePress(expenseType.value)}
              >
                {isSelected(expenseType.value) && (
                  <Icon
                    name="Check"
                    color={isDarkColorScheme ? "white" : "black"}
                  />
                )}
                <Text
                  className={cn(
                    "text-primary text-lg uppercase",
                    isSelected(expenseType.value) && "text-xl font-semibold"
                  )}
                >
                  {expenseType.label}
                </Text>
              </TouchableOpacity>
              <View
                className={cn(
                  "w-px h-8 bg-primary",
                  index === expenseTypes.length - 1 && "hidden"
                )}
              />
            </View>
          ))}
        </View>

        {/* Account / Category / Transfer Selection */}
        <View className="flex-row gap-4 justify-center items-center mb-8">
          {/* From Account */}
          <View>
            {isTransfer && <Label>From</Label>}
            <Button
              variant="outline"
              onPress={() => openBottomSheet(BottomSheetType.ACCOUNT, "from")}
              iconName={iconsRecord[selectedAccount?.imageUrl || "wallet"]}
              iconSize="24"
              className="px-2 w-44"
            >
              <Text className="text-primary text-lg uppercase">
                {selectedAccount?.name || "Account"}
              </Text>
            </Button>
          </View>

          {/* Category or To Account */}
          {!isTransfer ? (
            <Button
              variant="outline"
              onPress={() => openBottomSheet(BottomSheetType.CATEGORY, "to")}
              iconName={iconsRecord[selectedCategory?.imageUrl || "tag"]}
              iconSize="24"
              className="px-2 w-44"
            >
              <Text className="text-primary text-lg uppercase">
                {selectedCategory?.name || "Category"}
              </Text>
            </Button>
          ) : (
            <View>
              <Label>To</Label>
              <Button
                variant="outline"
                onPress={() => openBottomSheet(BottomSheetType.ACCOUNT, "to")}
                iconName={iconsRecord[selectedToAccount?.imageUrl || "wallet"]}
                iconSize="24"
                className="px-2 w-44"
              >
                <Text className="text-primary text-lg uppercase">
                  {selectedToAccount?.name || "Account"}
                </Text>
              </Button>
            </View>
          )}
        </View>

        {/* Description */}
        <form.Field
          name="description"
          children={(field) => (
            <View className="gap-2 w-full">
              <Label>Description</Label>
              <Textarea
                placeholder="Enter description"
                value={field.state.value}
                onChangeText={field.handleChange}
                autoCapitalize="none"
              />
              <FieldInfo field={field} />
            </View>
          )}
        />

        {/* Amount */}
        <form.Field
          name="amount"
          children={(field) => (
            <View className="gap-2 mb-8">
              <Label>Amount</Label>
              <Input
                placeholder="Enter amount"
                keyboardType="numeric"
                value={field.state.value?.toString() ?? ""}
                onChangeText={(text) => {
                  field.handleChange(text);
                }}
              />
              {/* <FieldInfo field={field} /> */}
            </View>
          )}
        />

        <form.Field
          name="updatedAt"
          children={(field) => (
            <View className="gap-2">
              <View className="flex-row justify-between items-center">
                <Button
                  variant="outline"
                  onPress={() => {
                    setMode("date");
                    setShowDatePicker(true);
                  }}
                  className="px-2 "
                  text={
                    field.state.value
                      ? new Date(field.state.value).toLocaleDateString("en-GB")
                      : new Date().toLocaleDateString("en-GB")
                  }
                  textColor={
                    isDarkColorScheme
                      ? NAV_THEME.dark.primary
                      : NAV_THEME.light.primary
                  }
                />

                <Button
                  variant="outline"
                  onPress={() => {
                    setMode("time");
                    setShowDatePicker(true);
                  }}
                  className="px-2 "
                  text={
                    field.state.value
                      ? new Date(field.state.value).toLocaleTimeString(
                          "en-US",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          }
                        )
                      : new Date().toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })
                  }
                  textColor={
                    isDarkColorScheme
                      ? NAV_THEME.dark.primary
                      : NAV_THEME.light.primary
                  }
                />
              </View>
              {showDatePicker && (
                <DateTimePicker
                  value={new Date(field.state.value || new Date())}
                  mode={mode}
                  is24Hour={false}
                  themeVariant={isDarkColorScheme ? "dark" : "light"}
                  display="default"
                  onChange={(event, selectedDate) => {
                    setShowDatePicker(false);
                    if (!selectedDate) return;

                    const current = new Date(field.state.value || new Date());

                    const updatedDate =
                      mode === "date"
                        ? new Date(
                            selectedDate.getFullYear(),
                            selectedDate.getMonth(),
                            selectedDate.getDate(),
                            current.getHours(),
                            current.getMinutes()
                          )
                        : new Date(
                            current.getFullYear(),
                            current.getMonth(),
                            current.getDate(),
                            selectedDate.getHours(),
                            selectedDate.getMinutes()
                          );

                    field.handleChange(updatedDate);
                  }}
                />
              )}
            </View>
          )}
        />
      </KeyboardAvoidingView>
      {/* Submit Button */}
      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting]}
        children={([canSubmit, isSubmitting]) => (
          <Button
            className="w-full mt-4"
            onPress={form.handleSubmit}
            disabled={!canSubmit || isSubmitting}
            isSubmitting={isSubmitting}
            text="Save"
            textColor={
              isDarkColorScheme
                ? NAV_THEME.dark.background
                : NAV_THEME.light.background
            }
          />
        )}
      />
      {/* Delete Button */}
      {expense && expense.id && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="destructive"
              disabled={deleteExpense.isPending}
              isSubmitting={deleteExpense.isPending}
              className="w-full mt-4"
              text="Delete Expense"
              textColor="white"
            />
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogTitle>
              <Text className="text-lg font-semibold mb-4">
                Are you sure you want to delete this expense?
              </Text>
            </AlertDialogTitle>
            <Text className="text-sm text-foreground mb-6">
              This action cannot be undone.
            </Text>
            <View className="flex-row justify-end gap-2">
              <AlertDialogCancel>
                <Text className="text-sm text-foreground">Cancel</Text>
              </AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive"
                onPress={() => handleDeleteExpense(expense?.id || "")}
              >
                <Text className="text-sm text-secondary">Delete</Text>
              </AlertDialogAction>
            </View>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {/* Bottom Sheet */}
      <BottomSheet
        ref={bottomSheetRef}
        data={
          bottomSheetType === BottomSheetType.ACCOUNT
            ? accounts ?? []
            : filteredCategories ?? []
        }
        title={
          bottomSheetType === BottomSheetType.ACCOUNT
            ? "Accounts"
            : "Categories"
        }
        renderItem={(item: Account | Category, index: number) => {
          const color = getColorByIndex(item.name);
          return (
            <Card key={item.id ?? index} className="mx-4 p-2 mb-8 bg-card">
              <TouchableOpacity
                onPress={() => {
                  if (bottomSheetType === BottomSheetType.ACCOUNT) {
                    if (accountSelectionTarget === "from") {
                      setSelectedAccount(item as Account);
                    } else {
                      setSelectedToAccount(item as Account);
                    }
                  } else {
                    setSelectedCategory(item as Category);
                  }
                  bottomSheetRef.current?.dismiss();
                }}
                className="flex-row gap-4 items-center"
              >
                <View
                  className="p-2 rounded-xl"
                  style={{ backgroundColor: color }}
                >
                  <Icon
                    name={iconsRecord[item.imageUrl || "other"]}
                    color={
                      isDarkColorScheme
                        ? NAV_THEME.dark.primary
                        : NAV_THEME.light.primary
                    }
                    size={32}
                  />
                </View>
                <Text className="text-xl text-primary font-semibold capitalize">
                  {item.name}
                </Text>
              </TouchableOpacity>
            </Card>
          );
        }}
      />
    </View>
  );
};
