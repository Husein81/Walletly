// Global imports
import { format } from "date-fns";
import { Pressable, Text, View } from "react-native";

// local imports
import { formattedBalance, getColorByIndex } from "@/functions";
import { iconsRecord, NAV_THEME } from "@/lib/config";
import { Icon } from "@/lib/icons/Icon";
import { cn } from "@/lib/utils";
import { Expense } from "@/types";
import { Card } from "../ui";
import { ExpenseForm } from "./ExpenseForm";

// Store imports
import { useColorScheme } from "@/lib/useColorScheme";
import { useModalStore } from "@/store/modalStore";
import { LinearGradient } from "expo-linear-gradient";

type Props = {
  expense: Expense;
};

export const ExpenseCard = ({ expense }: Props) => {
  const { isDarkColorScheme } = useColorScheme();
  const { onOpen } = useModalStore();

  const catColor = getColorByIndex(expense?.category?.imageUrl || "other");

  const handleOpen = (expense: Expense) =>
    onOpen(<ExpenseForm expense={expense} />, "Edit Expense");

  return (
    <Pressable onPress={() => handleOpen(expense)}>
      <LinearGradient
        colors={
          isDarkColorScheme
            ? ["#101010", "#18181b", "#27272a"]
            : ["#fafafa", "#f4f4f5", "#e4e4e7"]
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          width: "100%",
          maxWidth: 350,
          borderRadius: 14,
          padding: 18,
          shadowColor: "#000000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.25,
          shadowRadius: 12,
          elevation: 2,
          borderWidth: 1,
          borderColor: isDarkColorScheme
            ? "rgba(63, 63, 70, 0.3)"
            : "rgba(228, 228, 231, 0.8)",
        }}
        className="flex-row items-center gap-4 mb-4"
      >
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
                  : NAV_THEME.light.text
              }
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
                        ? NAV_THEME.dark.primary
                        : NAV_THEME.light.primary
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
              expense.type === "TRANSFER" && "text-blue-500"
            )}
          >
            {formattedBalance(expense.amount)}
          </Text>
          <Text className="text-xs text-muted-foreground">
            {format(new Date(expense.updatedAt ?? new Date()), "EEE, dd MMM")}
          </Text>
        </View>
      </LinearGradient>
    </Pressable>
  );
};
