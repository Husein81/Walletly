// Global Imports
import DateTimePicker from "@react-native-community/datetimepicker";
import { useForm } from "@tanstack/react-form";
import { useCallback, useMemo, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

// Local Imports
import { Label, Rn } from "@/components/ui";
import { InputField, TextareaField } from "@/components/ui-components";
import BottomSheet, {
  BottomSheetRef,
} from "@/components/ui-components/BottomSheet";
import { getColorByIndex } from "@/functions";
import { useGetAccounts } from "@/hooks/accounts";
import { useCategories } from "@/hooks/categories";
import {
  useCreateExpense,
  useDeleteExpense,
  useUpdateExpense,
} from "@/hooks/expense";
import { iconsRecord } from "@/lib/config";
import { Icon } from "@/lib/icons/Icon";
import { useColorScheme } from "@/lib/useColorScheme";
import { cn } from "@/lib/utils";
import { Account, Category, Expense, ExpenseType } from "@/types";

// store imports
import { useAuthStore, useModalStore } from "@/store";

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
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
        keyboardVerticalOffset={100}
        style={{ flex: 1 }}
      >
        {/* Expense Type Selection - Modern Toggle Pills */}
        <View className="mb-6">
          <Label className="mb-3 text-base font-semibold">
            Transaction Type
          </Label>
          <View className="flex-row gap-2">
            {expenseTypes.map((expenseType) => {
              const isSelectedType = isSelected(expenseType.value);
              const isExpenseType = expenseType.value === ExpenseType.EXPENSE;
              const isIncomeType = expenseType.value === ExpenseType.INCOME;

              return (
                <Pressable
                  key={expenseType.value}
                  onPress={() => handleExpenseTypePress(expenseType.value)}
                  className="flex-1 active:scale-95"
                >
                  <View
                    className={cn(
                      "py-3 px-4 rounded-xl items-center border border-border bg-card/50",
                      {
                        "bg-red-600/30 border-red-600":
                          isSelectedType && isExpenseType,
                      },
                      {
                        "bg-green-600/30 border-green-600":
                          isSelectedType && isIncomeType,
                      },
                      {
                        "bg-blue-600/30 border-blue-600":
                          isSelectedType && isTransfer,
                      }
                    )}
                  >
                    <Text
                      className={cn(
                        "text-muted-foreground font-medium text-sm",
                        { "text-red-600": isSelectedType && isExpenseType },
                        { "text-green-600": isSelectedType && isIncomeType },
                        { "text-blue-600": isSelectedType && isTransfer }
                      )}
                    >
                      {expenseType.label}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Account / Category / Transfer Selection */}
        <View className="mb-6 gap-4">
          {/* From Account */}
          <View>
            <Label className="mb-2 text-sm font-medium">
              {isTransfer ? "From Account" : "Account"}
            </Label>
            <Pressable
              onPress={() => openBottomSheet(BottomSheetType.ACCOUNT, "from")}
              className="bg-card border border-border rounded-xl p-4 flex-row items-center justify-between"
            >
              <View className="flex-row items-center gap-3">
                <View
                  className="p-2 rounded-lg"
                  style={{
                    backgroundColor: getColorByIndex(
                      selectedAccount?.name || "default"
                    ),
                  }}
                >
                  <Icon
                    name={iconsRecord[selectedAccount?.imageUrl || "wallet"]}
                    color="#fff"
                    size={20}
                  />
                </View>
                <Text className="text-foreground font-medium">
                  {selectedAccount?.name || "Select Account"}
                </Text>
              </View>
              <Icon name="ChevronRight" size={20} color="#9ca3af" />
            </Pressable>
          </View>

          {/* Category or To Account */}
          {!isTransfer ? (
            <View>
              <Label className="mb-2 text-sm font-medium">Category</Label>
              <Pressable
                onPress={() => openBottomSheet(BottomSheetType.CATEGORY, "to")}
                className="bg-card border border-border rounded-xl p-4 flex-row items-center justify-between"
              >
                <View className="flex-row items-center gap-3">
                  <View
                    className="p-2 rounded-lg"
                    style={{
                      backgroundColor: getColorByIndex(
                        selectedCategory?.name || "default"
                      ),
                    }}
                  >
                    <Icon
                      name={iconsRecord[selectedCategory?.imageUrl || "tag"]}
                      color="#fff"
                      size={20}
                    />
                  </View>
                  <Text className="text-foreground font-medium">
                    {selectedCategory?.name || "Select Category"}
                  </Text>
                </View>
                <Icon name="ChevronRight" size={20} color="#9ca3af" />
              </Pressable>
            </View>
          ) : (
            <View>
              <Label className="mb-2 text-sm font-medium">To Account</Label>
              <Pressable
                onPress={() => openBottomSheet(BottomSheetType.ACCOUNT, "to")}
                className="bg-card border border-border rounded-xl p-4 flex-row items-center justify-between"
              >
                <View className="flex-row items-center gap-3">
                  <View
                    className="p-2 rounded-lg"
                    style={{
                      backgroundColor: getColorByIndex(
                        selectedToAccount?.name || "default"
                      ),
                    }}
                  >
                    <Icon
                      name={
                        iconsRecord[selectedToAccount?.imageUrl || "wallet"]
                      }
                      color="#fff"
                      size={20}
                    />
                  </View>
                  <Text className="text-foreground font-medium">
                    {selectedToAccount?.name || "Select Account"}
                  </Text>
                </View>
                <Icon name="ChevronRight" size={20} color="#9ca3af" />
              </Pressable>
            </View>
          )}
        </View>
        {/* Amount */}
        <form.Field
          name="amount"
          children={(field) => (
            <InputField
              type="number"
              label="Amount"
              field={field}
              placeholder="Enter amount"
              keyboardType="numeric"
            />
          )}
        />

        {/* Description */}
        <form.Field
          name="description"
          children={(field) => (
            <TextareaField
              label="Description"
              field={field}
              placeholder="Add a note (optional)"
              autoCapitalize="none"
            />
          )}
        />

        <form.Field
          name="updatedAt"
          children={(field) => (
            <View className="gap-2 mb-6">
              <Label className="mb-2 text-sm font-medium">Date & Time</Label>
              <View className="flex-row gap-3">
                <Pressable
                  onPress={() => {
                    setMode("date");
                    setShowDatePicker(true);
                  }}
                  className="flex-1 bg-card border border-border rounded-xl p-4 flex-row items-center justify-between"
                >
                  <View className="flex-row items-center gap-2">
                    <Icon name="Calendar" size={18} color="#9ca3af" />
                    <Text className="text-foreground font-medium">
                      {field.state.value
                        ? new Date(field.state.value).toLocaleDateString(
                            "en-GB",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }
                          )
                        : new Date().toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                    </Text>
                  </View>
                </Pressable>

                <Pressable
                  onPress={() => {
                    setMode("time");
                    setShowDatePicker(true);
                  }}
                  className="flex-1 bg-card border border-border rounded-xl p-4 flex-row items-center justify-between"
                >
                  <View className="flex-row items-center gap-2">
                    <Icon name="Clock" size={18} color="#9ca3af" />
                    <Text className="text-foreground font-medium">
                      {field.state.value
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
                          })}
                    </Text>
                  </View>
                </Pressable>
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
          <Pressable
            onPress={form.handleSubmit}
            disabled={!canSubmit || isSubmitting}
            className="mt-6"
          >
            <View
              className={cn(
                "py-4 rounded-xl items-center",
                {
                  "bg-green-500": selectedExpenseType === ExpenseType.INCOME,
                },
                { "bg-red-500": selectedExpenseType === ExpenseType.EXPENSE },
                { "bg-blue-500": selectedExpenseType === ExpenseType.TRANSFER },
                (!canSubmit || isSubmitting) && "opacity-50"
              )}
            >
              <Text className="text-white font-bold text-base">
                {isSubmitting
                  ? "Saving..."
                  : expense
                  ? "Update Transaction"
                  : "Save Transaction"}
              </Text>
            </View>
          </Pressable>
        )}
      />
      {/* Delete Button */}
      {expense && expense.id && (
        <Rn.AlertDialog>
          <Rn.AlertDialogTrigger asChild>
            <Pressable className="mt-4 py-4 border-2 border-destructive rounded-xl items-center">
              <Text className="text-destructive font-semibold text-base">
                {deleteExpense.isPending ? "Deleting..." : "Delete Transaction"}
              </Text>
            </Pressable>
          </Rn.AlertDialogTrigger>
          <Rn.AlertDialogContent>
            <Rn.AlertDialogTitle>
              <Text className="text-lg font-semibold mb-4">
                Delete Transaction?
              </Text>
            </Rn.AlertDialogTitle>
            <Text className="text-sm text-muted-foreground mb-6">
              This action cannot be undone. This will permanently delete your
              transaction.
            </Text>
            <View className="flex-row justify-end gap-3">
              <Rn.AlertDialogCancel>
                <View className="px-6 py-2 rounded-lg bg-card">
                  <Text className="text-sm font-medium text-foreground">
                    Cancel
                  </Text>
                </View>
              </Rn.AlertDialogCancel>
              <Rn.AlertDialogAction
                className="px-6 py-2 rounded-lg bg-destructive"
                onPress={() => handleDeleteExpense(expense?.id || "")}
              >
                <Text className="text-sm font-medium text-white">Delete</Text>
              </Rn.AlertDialogAction>
            </View>
          </Rn.AlertDialogContent>
        </Rn.AlertDialog>
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
            ? "Select Account"
            : "Select Category"
        }
        renderItem={(item: Account | Category, index: number) => {
          const color = getColorByIndex(item.name);
          const isAccountType = bottomSheetType === BottomSheetType.ACCOUNT;
          const isSelectedItem = isAccountType
            ? accountSelectionTarget === "from"
              ? selectedAccount?.id === item.id
              : selectedToAccount?.id === item.id
            : selectedCategory?.id === item.id;

          return (
            <Pressable
              key={item.id ?? index}
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
              className={cn(
                "mx-4 mb-3 p-4 rounded-xl flex-row items-center justify-between bg-card border",
                isSelectedItem
                  ? "border-primary bg-primary/10"
                  : "border-border"
              )}
            >
              <View className="flex-row items-center gap-3">
                <View
                  className="p-3 rounded-xl"
                  style={{ backgroundColor: color }}
                >
                  <Icon
                    name={iconsRecord[item.imageUrl || "Wallet"]}
                    color="#fff"
                    size={24}
                  />
                </View>
                <View>
                  <Text className="text-base font-semibold text-foreground capitalize">
                    {item.name}
                  </Text>
                  {isAccountType && (item as Account).balance !== undefined && (
                    <Text className="text-sm text-muted-foreground">
                      Balance: ${Number((item as Account).balance).toFixed(2)}
                    </Text>
                  )}
                </View>
              </View>
              {isSelectedItem && (
                <View className="bg-primary rounded-full p-1">
                  <Icon name="Check" size={16} color="white" />
                </View>
              )}
            </Pressable>
          );
        }}
      />
    </View>
  );
};
