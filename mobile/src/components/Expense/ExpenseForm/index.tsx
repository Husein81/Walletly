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
import { Card, Input, Label, Textarea } from "~/components/ui";
import { Button, FieldInfo } from "~/components/ui-components";
import BottomSheet, {
  BottomSheetRef,
} from "~/components/ui-components/BottomSheet";
import { useGetAccounts } from "~/hooks/accounts";
import { useCategories } from "~/hooks/categories";
import { iconsRecord, NAV_THEME } from "~/lib/config";
import { getColorByIndex } from "~/lib/functions";
import { Icon } from "~/lib/icons/Icon";
import { useColorScheme } from "~/lib/useColorScheme";
import { cn } from "~/lib/utils";
import { Account, Category, Expense, ExpenseType } from "~/types";

// store imports
import { useAuthStore } from "~/store/authStore";
import useModalStore from "~/store/modalStore";

type Props = {
  expense?: Expense;
};

enum BottomSheetType {
  ACCOUNT = "ACCOUNT",
  CATEGORY = "CATEGORY",
}

const ExpenseForm = ({ expense }: Props) => {
  const { user } = useAuthStore();
  const { onClose } = useModalStore();
  const { isDarkColorScheme } = useColorScheme();

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
    undefined
  );
  const [selectedToAccount, setSelectedToAccount] = useState<
    Account | undefined
  >(undefined);
  const [selectedCategory, setSelectedCategory] = useState<
    Category | undefined
  >(undefined);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
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

  const form = useForm({
    defaultValues: {
      type: expense?.type || selectedExpenseType,
      category: expense?.category || selectedCategory,
      amount: expense?.amount || "",
      description: expense?.description || "",
      createdAt: expense?.createdAt || selectedDate,
      updatedAt: expense?.updatedAt || selectedDate,
    },
    onSubmit: async ({ value }) => {
      const payload = {
        ...value,
        accountId: selectedAccount?.id,
        categoryId: selectedCategory?.id,
        userId: user?.id || "",
      };
      // Handle form submission logic here
      Toast.show({
        type: "success",
        text1: "Form submitted successfully",
        text2: JSON.stringify(payload),
      });
      onClose();
    },
  });

  return (
    <View className="flex-1">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
        keyboardVerticalOffset={100}
        style={{ flex: 1 }}
      >
        {/* Header */}
        <View className="flex-row items-center justify-between mb-8">
          <Button variant="ghost" onPress={onClose} iconName="X">
            <Text className="text-primary uppercase font-semibold">Close</Text>
          </Button>
          <Button variant="ghost" onPress={onClose} iconName="Check">
            <Text className="text-primary uppercase font-semibold">Save</Text>
          </Button>
        </View>

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
              iconSize="28"
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
              iconSize="28"
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
                iconSize="28"
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
                  // Accept negative, positive, and decimals
                  const numericValue = parseFloat(text);
                  if (
                    !isNaN(numericValue) ||
                    text.includes("") ||
                    text.includes("-") ||
                    text.includes(".")
                  ) {
                    // Allow empty string or negative sign
                    field.handleChange(
                      text.includes("") ||
                        text.includes("-") ||
                        text.includes(".")
                        ? text
                        : numericValue
                    );
                  }
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

export default ExpenseForm;
