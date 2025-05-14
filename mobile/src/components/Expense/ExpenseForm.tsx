// Global Imports
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useCallback, useMemo, useRef, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

// Local Imports
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useGetAccounts } from "~/hooks/accounts";
import { useCategories } from "~/hooks/categories";
import { Icon } from "~/lib/icons/Icon";
import { useColorScheme } from "~/lib/useColorScheme";
import { cn } from "~/lib/utils";
import { Expense, ExpenseType } from "~/types";
import { Button } from "../ui";
import { Option } from "../ui/select";

// store imports
import { useAuthStore } from "~/store/authStore";
import useModalStore from "~/store/modalStore";

type Props = {
  expense?: Expense;
};

const ExpenseForm = ({ expense }: Props) => {
  const { user } = useAuthStore();
  const { onClose } = useModalStore();
  const { data: accounts } = useGetAccounts(user?.id || "");
  const { data: categories } = useCategories(user?.id || "");
  const [selectedExpenseType, setSelectedExpenseType] = useState<ExpenseType>(
    expense?.type || ExpenseType.EXPENSE
  );

  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const [selectedAccount, setSelectedAccount] = useState<Option>(undefined);
  const [selectedCategory, setSelectedCategory] = useState<Option>(undefined);

  const isSelected = (type: ExpenseType) => selectedExpenseType === type;

  const handleExpenseTypePress = (type: ExpenseType) => {
    setSelectedExpenseType(type);
  };

  const snapPoints = useMemo(() => ["25%", "50%"], []);

  const handleOpen = useCallback(() => {
    bottomSheetRef.current?.present();
  }, []);
  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  const expenseTypes = [
    { label: "Income", value: ExpenseType.INCOME },
    { label: "Expense", value: ExpenseType.EXPENSE },
    { label: "Transfer", value: ExpenseType.TRANSFER },
  ];

  const accountOptions = accounts?.map((account) => ({
    label: account.name,
    value: account.id || "",
  }));

  const categoryOptions = categories?.map((category) => ({
    label: category.name,
    value: category.id || "",
  }));

  const { isDarkColorScheme } = useColorScheme();
  return (
    <View className="flex-1 bg-background p-4 gap-8">
      <View className="flex-row items-center justify-between">
        <Button variant={"ghost"} onPress={onClose}>
          <Text className="text-primary text-xl">Cancel</Text>
        </Button>
        <Button variant={"ghost"} onPress={onClose}>
          <Text className="text-primary text-xl">Save</Text>
        </Button>
      </View>

      {/* Expense Types selection */}
      <View className="flex-row gap-4 justify-center items-center">
        {expenseTypes.map((expenseType, index) => (
          <View key={expenseType.value} className="flex-row gap-2">
            <TouchableOpacity
              className="flex-row gap-2 items-center justify-center"
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

      {/* Selection */}
      <View className="flex-row gap-4 justify-center items-center">
        <Button
          variant={"outline"}
          onPress={handleOpen}
          className="flex-row items-center justify-between"
        >
          <Icon
            onPress={handleOpen}
            name="Wallet"
            color={isDarkColorScheme ? "white" : "black"}
          />
          <Text className="text-primary">Account</Text>
        </Button>
        <Button
          variant={"outline"}
          onPress={handleOpen}
          className="flex-row items-center justify-between"
        >
          <Icon
            onPress={handleOpen}
            name="Tag"
            color={isDarkColorScheme ? "white" : "black"}
          />
          <Text className="text-primary">Expense</Text>
        </Button>
      </View>
      <GestureHandlerRootView className="flex-1 bg-white">
        <BottomSheetModalProvider>
          <BottomSheetModal
            ref={bottomSheetRef}
            snapPoints={snapPoints}
            onChange={handleSheetChanges}
          >
            <BottomSheetView style={{ padding: 20 }}>
              <Text style={{ fontSize: 18 }}>This is a bottom drawer!</Text>
            </BottomSheetView>
          </BottomSheetModal>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </View>
  );
};
export default ExpenseForm;
