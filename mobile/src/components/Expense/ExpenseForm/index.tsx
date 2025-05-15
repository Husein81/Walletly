// Global Imports
import { useCallback, useMemo, useRef, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

// Local Imports
import { Card, Label } from "~/components/ui";
import { Button } from "~/components/ui-components";
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
  const [selectedAccount, setSelectedAccount] = useState<Account | undefined>(
    undefined
  );
  const [selectedCategory, setSelectedCategory] = useState<
    Category | undefined
  >(undefined);

  const [bottomSheetType, setBottomSheetType] =
    useState<BottomSheetType | null>(null);

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

  const openBottomSheet = (type: BottomSheetType) => {
    setBottomSheetType(type);
    bottomSheetRef.current?.present();
  };

  return (
    <View className="flex-1 py-2 gap-8">
      {/* Header */}
      <View className="flex-row items-center justify-between">
        <Button variant={"ghost"} onPress={onClose} iconName="X">
          <Text className="text-primary uppercase font-semibold">Close</Text>
        </Button>
        <Button variant={"ghost"} onPress={onClose} iconName="Check">
          <Text className="text-primary uppercase font-semibold">Save</Text>
        </Button>
      </View>

      {/* Expense Types selection */}
      <View className="flex-row gap-4 justify-center items-center mb-8">
        {expenseTypes.map((expenseType, index) => (
          <View key={expenseType.value} className="flex-row gap-2 ">
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

      {/* Selection */}
      <View className="flex-row gap-4 justify-center items-center">
        <View>
          {isTransfer && <Label>From </Label>}
          <Button
            variant="outline"
            onPress={() => openBottomSheet(BottomSheetType.ACCOUNT)}
            iconName={iconsRecord[selectedAccount?.imageUrl || "wallet"]}
            iconSize="28"
            className="px-2 w-44"
          >
            <Text className="text-primary text-lg uppercase">
              {selectedAccount?.name || "Account"}
            </Text>
          </Button>
        </View>
        {!isTransfer && (
          <Button
            variant="outline"
            onPress={() => openBottomSheet(BottomSheetType.CATEGORY)}
            iconName={iconsRecord[selectedCategory?.imageUrl || "tag"]}
            iconSize="28"
            className="px-2 w-44"
          >
            <Text className="text-primary text-lg uppercase">
              {selectedCategory?.name || "Category"}
            </Text>
          </Button>
        )}
        {isTransfer && (
          <View>
            <Label>To </Label>
            <Button
              variant="outline"
              onPress={() => openBottomSheet(BottomSheetType.ACCOUNT)}
              iconName={iconsRecord[selectedAccount?.imageUrl || "wallet"]}
              iconSize="28"
              className="px-2 w-44"
            >
              <Text className="text-primary text-lg uppercase">
                {selectedAccount?.name || "Account"}
              </Text>
            </Button>
          </View>
        )}
      </View>

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
            <Card
              key={(item as Account | Category).id ?? index}
              className="mx-4 p-2 mb-4 bg-card"
            >
              <TouchableOpacity
                onPress={() => {
                  if (bottomSheetType === BottomSheetType.ACCOUNT) {
                    setSelectedAccount(item as Account);
                  } else {
                    setSelectedCategory(item as Category);
                  }
                  bottomSheetRef.current?.dismiss();
                }}
                className="flex-row gap-4 items-center"
              >
                <View
                  className={cn("p-2 rounded-xl")}
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
                  {(item as Account | Category).name}
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
