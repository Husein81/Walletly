// Global Imports
import DateTimePicker from "@react-native-community/datetimepicker";
import { useForm } from "@tanstack/react-form";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

// Local Imports
import { Button, Icon, Label } from "@/components/ui";
import {
  AlertDialog,
  InputField,
  TextareaField,
} from "@/components/ui-components";
import { useGetAccounts } from "@/hooks/accounts";
import { useCategories } from "@/hooks/categories";
import {
  useCreateExpense,
  useDeleteExpense,
  useUpdateExpense,
} from "@/hooks/expense";
import { iconsRecord } from "@/constants";
import { useColorScheme } from "@/lib/useColorScheme";
import { cn } from "@/lib/utils";
import { Account, Category, Expense, ExpenseType } from "@/types";
import { formattedBalance } from "@/utils";

// store imports
import { NAV_THEME } from "@/lib/theme";
import { useAuthStore, useBottomSheetStore, useModalStore } from "@/store";
import AccountSelection from "./AccountSelection";
import { AmountKeypad } from "./AmountKeypad";
import CategorySelection from "./CategorySelection";

type Props = {
  expense?: Expense;
};

export const ExpenseForm = ({ expense }: Props) => {
  const { user } = useAuthStore();
  const { onClose } = useModalStore();
  const { onOpen: onOpenBS, onClose: onCloseBS } = useBottomSheetStore();
  const { isDarkColorScheme } = useColorScheme();

  // Fetch accounts and categories
  const { data: accounts } = useGetAccounts(user?.id || "");
  const { data: categories } = useCategories(user?.id || "");

  const [selectedExpenseType, setSelectedExpenseType] = useState<ExpenseType>(
    expense?.type || ExpenseType.EXPENSE,
  );
  const [selectedAccount, setSelectedAccount] = useState<Account | undefined>(
    expense?.fromAccount || undefined,
  );
  const [selectedToAccount, setSelectedToAccount] = useState<
    Account | undefined
  >(expense?.toAccount || undefined);
  const [selectedCategory, setSelectedCategory] = useState<
    Category | undefined
  >(expense?.category || undefined);

  const [mode, setMode] = useState<"date" | "time">("date");
  const [showDatePicker, setShowDatePicker] = useState(false);

  // expense types
  const expenseTypes = [
    { label: "Income", value: ExpenseType.INCOME, icon: "CircleArrowUp" },
    { label: "Expense", value: ExpenseType.EXPENSE, icon: "CircleArrowDown" },
    {
      label: "Transfer",
      value: ExpenseType.TRANSFER,
      icon: "LayoutDashboard",
    },
  ];

  const isSelected = (type: ExpenseType) => selectedExpenseType === type;
  const isTransfer = selectedExpenseType === ExpenseType.TRANSFER;

  const filteredCategories = useMemo(() => {
    if (!categories) return [];
    return categories.filter((cat) => cat.type === selectedExpenseType);
  }, [categories, selectedExpenseType]);

  const handleExpenseTypePress = (type: ExpenseType) => {
    if (type !== selectedExpenseType) {
      setSelectedCategory(undefined);
      setSelectedExpenseType(type);
    }
  };

  const handleOpenCategory = () => {
    const data = filteredCategories ?? [];
    const title = "Select Category";

    onOpenBS(
      <CategorySelection
        title={title}
        data={data}
        selectedCategory={selectedCategory}
        onSelect={(item) => {
          setSelectedCategory(item as Category);
          onCloseBS();
        }}
      />,
    );
  };

  const handleOpenAccount = (target: "from" | "to") => {
    const data = accounts ?? [];
    const title = target === "to" ? "Select To Account" : "Select From Account";
    onOpenBS(
      <AccountSelection
        title={title}
        data={data}
        selectedAccount={selectedAccount}
        selectedToAccount={selectedToAccount}
        target={target}
        onSelect={(item) => {
          if (target === "to") {
            setSelectedToAccount(item as Account);
          } else {
            setSelectedAccount(item as Account);
          }
          onCloseBS();
        }}
      />,
    );
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
      amount: expense?.amount
        ? Math.abs(Number(expense.amount)).toString()
        : "",
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
            id: expense.id!,
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
            {expense ? "Edit Expense" : "New Expense"}
          </Label>
          <View className="flex-row gap-2 bg-primary/10 p-1 rounded-xl">
            {expenseTypes.map((expenseType) => {
              const isSelectedType = isSelected(expenseType.value);
              return (
                <Button
                  key={expenseType.value}
                  onPress={() => handleExpenseTypePress(expenseType.value)}
                  className={cn(
                    "flex-row flex-1 rounded-xl gap-1 py-3 px-4  items-center",
                    {
                      "bg-primary text-white": isSelectedType,
                    },
                  )}
                  variant={isSelectedType ? "default" : "ghost"}
                >
                  <Icon
                    name={expenseType.icon}
                    size={14}
                    color={isSelectedType ? "white" : "#6b7280"}
                  />
                  <Text
                    className={cn("text-muted-foreground font-medium text-sm", {
                      "text-white": isSelectedType,
                    })}
                  >
                    {expenseType.label}
                  </Text>
                </Button>
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
              onPress={() => handleOpenAccount("from")}
              className="bg-primary/10 border border-border rounded-xl p-4 flex-row items-center justify-between"
            >
              <View className="flex-row items-center gap-3">
                <View className="p-2 rounded-xl bg-primary/10">
                  <Icon
                    name={iconsRecord[selectedAccount?.imageUrl || "wallet"]}
                    color="#14B8A6"
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
                onPress={() => handleOpenCategory()}
                className="bg-primary/10 border border-border rounded-xl p-4 flex-row items-center justify-between"
              >
                <View className="flex-row items-center gap-3">
                  <View className="p-2 rounded-xl bg-primary/10">
                    <Icon
                      name={iconsRecord[selectedCategory?.imageUrl || "tag"]}
                      color="#14B8A6"
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
                onPress={() => handleOpenAccount("to")}
                className="bg-primary/10 border border-border rounded-xl p-4 flex-row items-center justify-between"
              >
                <View className="flex-row items-center gap-3">
                  <View className="p-2 rounded-xl bg-primary/10">
                    <Icon
                      name={
                        iconsRecord[selectedToAccount?.imageUrl || "wallet"]
                      }
                      color="#14B8A6"
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
            <View className="gap-2 mb-6">
              <Label className="mb-2 text-sm font-medium">Amount</Label>
              <Pressable
                onPress={() =>
                  onOpenBS(
                    <AmountKeypad
                      initialValue={field.state.value.toString()}
                      onConfirm={(val) => field.handleChange(val)}
                    />,
                  )
                }
                className="flex-row items-center justify-between bg-card border border-border rounded-xl p-4 h-14"
              >
                <View className="flex-row items-center gap-2">
                  <Text
                    className={cn(
                      "text-xl font-semibold",
                      selectedExpenseType === ExpenseType.EXPENSE
                        ? "text-red-500"
                        : selectedExpenseType === ExpenseType.INCOME
                          ? "text-green-600"
                          : "text-teal-500",
                    )}
                  >
                    {formattedBalance(
                      field.state.value
                        ? selectedExpenseType === ExpenseType.EXPENSE
                          ? -Math.abs(Number(field.state.value))
                          : Math.abs(Number(field.state.value))
                        : 0,
                      user?.currency,
                    )}
                  </Text>
                </View>
                <Icon name="Calculator" size={20} color="#9ca3af" />
              </Pressable>
              {field.state.meta.errors && (
                <Text className="text-destructive text-xs mt-1">
                  {field.state.meta.errors.join(", ")}
                </Text>
              )}
            </View>
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
                            },
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
                            },
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
                  accentColor="#0D9488"
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
                            current.getMinutes(),
                          )
                        : new Date(
                            current.getFullYear(),
                            current.getMonth(),
                            current.getDate(),
                            selectedDate.getHours(),
                            selectedDate.getMinutes(),
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
                "py-4 rounded-xl items-center bg-primary",
                (!canSubmit || isSubmitting) && "opacity-50",
              )}
            >
              <Text className="text-white font-bold text-base">
                {isSubmitting ? (
                  <ActivityIndicator
                    color={
                      isDarkColorScheme
                        ? NAV_THEME.dark.colors.background
                        : NAV_THEME.light.colors.background
                    }
                  />
                ) : expense ? (
                  "Update"
                ) : (
                  "Save"
                )}
              </Text>
            </View>
          </Pressable>
        )}
      />
      {/* Delete Button */}
      {expense && expense.id && (
        <AlertDialog
          title="Delete Expense?"
          description="Are you sure you want to delete this expense?"
          action="Delete"
          icon="Trash2"
          iconColor="#f87171"
          onPress={() => handleDeleteExpense(expense?.id ?? "")}
        />
      )}
    </View>
  );
};
