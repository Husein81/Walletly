// Global imports
import { format } from "date-fns";
import { View, Text, Pressable } from "react-native";

// local imports
import { formattedBalance } from "~/functions";
import { iconsRecord, NAV_THEME } from "~/lib/config";
import { cn } from "~/lib/utils";
import { Expense } from "~/types";
import { AlertDialog, Card } from "../ui";
import { useColorScheme } from "~/lib/useColorScheme";
import { getColorByIndex } from "~/functions";
import useModalStore from "~/store/modalStore";
import {
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Button } from "../ui-components";
import { CardContent } from "../ui/card";
import { Icon } from "~/lib/icons/Icon";
import { useState } from "react";
import ExpenseForm from "./ExpenseForm";

type Props = {
  expense: Expense;
};

const ExpenseCard = ({ expense }: Props) => {
  const { isDarkColorScheme } = useColorScheme();
  const { onOpen } = useModalStore();

  const catColor = getColorByIndex(expense?.category?.imageUrl || "other");

  const handleOpen = (expense: Expense) =>
    onOpen(<ExpenseForm expense={expense} />, "Edit Expense");

  return (
    <Pressable onPress={() => handleOpen(expense)}>
      <Card className="flex-row py-2 shadow px-3 rounded-xl justify-between items-center gap-4 mb-3">
        <View className="flex-row gap-4 items-center">
          <View
            className="p-2 rounded-xl"
            style={{ backgroundColor: catColor }}
          >
            <Icon
              name={
                expense.type === "TRANSFER"
                  ? "ArrowRightLeft"
                  : iconsRecord[expense?.category?.imageUrl || "other"]
              }
              color={
                isDarkColorScheme
                  ? NAV_THEME.dark.primary
                  : NAV_THEME.light.primary
              }
              size={32}
            />
          </View>
          <View>
            <Text className="text-primary text-xl capitalize">
              {expense?.category?.name || "Transfer"}
            </Text>
            <View className="flex-row items-center gap-2">
              <Text className="text-primary  capitalize">
                {expense.fromAccount.name}
              </Text>
              {expense.type === "TRANSFER" && expense.toAccount && (
                <>
                  <Icon
                    name="ArrowRight"
                    size={16}
                    color={
                      isDarkColorScheme
                        ? NAV_THEME.dark.primary
                        : NAV_THEME.light.primary
                    }
                  />
                  <Text className="text-primary text-xs capitalize">
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
              "text-xl font-semibold",
              expense.amount < 0 ? "text-red-500" : "text-green-500",
              expense.type === "TRANSFER" && "text-blue-500"
            )}
          >
            {formattedBalance(expense.amount)}
          </Text>
          <Text className="text-xs text-primary">
            {format(new Date(expense.updatedAt ?? new Date()), "EEE, dd MMM")}
          </Text>
        </View>
      </Card>
    </Pressable>
  );
};
export default ExpenseCard;
