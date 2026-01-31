// Global imports
import { Pressable, Text, View } from "react-native";

// local imports
import { formatSmartDateTime, formattedBalance } from "@/utils";
import { iconsRecord } from "@/lib/config";
import { Icon } from "@/lib/icons/Icon";
import { cn } from "@/lib/utils";
import { Expense } from "@/types";
import { ExpenseForm } from "./ExpenseForm";

// Store imports
import { NAV_THEME } from "@/lib/theme";
import { useColorScheme } from "@/lib/useColorScheme";
import { useModalStore } from "@/store/modalStore";

type Props = {
  expense: Expense;
};

export const ExpenseCard = ({ expense }: Props) => {
  const { isDarkColorScheme } = useColorScheme();
  const { onOpen } = useModalStore();

  const handleOpen = (expense: Expense) =>
    onOpen(<ExpenseForm expense={expense} />, "Edit Expense");

  return (
    <Pressable onPress={() => handleOpen(expense)}>
      <View className="flex-row py-2">
        <View className="flex-row gap-4 items-center">
          <View className="p-2 rounded-xl bg-primary/10">
            <Icon
              name={
                expense.type === "TRANSFER"
                  ? "ArrowRightLeft"
                  : iconsRecord[expense?.category?.imageUrl || "other"]
              }
              color={
                isDarkColorScheme
                  ? NAV_THEME.dark.colors.primary
                  : NAV_THEME.light.colors.primary
              }
              size={24}
            />
          </View>
          <View>
            <Text className="text-foreground text-xl capitalize">
              {expense?.category?.name || "Transfer"}
            </Text>
            <View className="flex-row items-center gap-2">
              <Text className="text-muted-foreground text-xs capitalize">
                {expense.fromAccount.name}
              </Text>
              {expense.type === "TRANSFER" && expense.toAccount && (
                <>
                  <Icon
                    name="ArrowRight"
                    size={16}
                    color={
                      isDarkColorScheme
                        ? NAV_THEME.dark.colors.primary
                        : NAV_THEME.light.colors.primary
                    }
                  />
                  <Text className="text-muted-foreground text-xs capitalize">
                    {expense.toAccount.name}
                  </Text>
                </>
              )}
            </View>
          </View>
        </View>
        <View className="flex-1 justify-center items-end">
          <Text
            className={cn(
              "font-semibold",
              expense.amount < 0 ? "text-red-500" : "text-green-500",
              expense.type === "TRANSFER" && "text-teal-500",
            )}
          >
            {formattedBalance(expense.amount)}
          </Text>
          <Text className="text-xs text-muted-foreground">
            {formatSmartDateTime(new Date(expense.updatedAt ?? new Date()))}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};
