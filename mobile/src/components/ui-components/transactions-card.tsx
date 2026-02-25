import { formattedBalance } from "@/utils";
import { Icon } from "@/components/ui";
import React from "react";
import { Text, View } from "react-native";
import { Rn } from "../ui";
import { useAuthStore } from "@/store";

type Props = {
  total: number;
  expense: number;
  income: number;
};

export const TransactionsCard = ({ total, expense, income }: Props) => {
  const { user } = useAuthStore();
  return (
    <View className="mb-6">
      {/* Total */}
      <View className="bg-card rounded-2xl p-5 border border-border">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">
              Total Balance
            </Text>
            <Text className="text-2xl font-extrabold text-foreground mt-2">
              {user?.currency?.symbol || "$"}
              {total.toFixed(2)}
            </Text>
          </View>

          <View className="size-12 rounded-2xl bg-primary/10 items-center justify-center">
            <Icon name="Wallet" size={22} color="#14B8A6" />
          </View>
        </View>
      </View>

      {/* Income / Expenses */}
      <View className="flex-row gap-4 mt-4">
        <View className="flex-1 bg-card rounded-2xl p-5 border border-border">
          <View className="flex-row items-center justify-between gap-2">
            <View>
              <Text className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">
                Income
              </Text>
              <Text className="text-lg font-extrabold text-foreground mt-2">
                {user?.currency?.symbol || "$"}
                {income.toFixed(2)}
              </Text>
            </View>
            <View className="size-8 rounded-2xl bg-green-500/10 items-center justify-center">
              <Icon name="ArrowUpRight" size={18} color="#22C55E" />
            </View>
          </View>
        </View>

        <View className="flex-1 bg-card rounded-2xl p-5 border border-border">
          <View className="flex-row items-center justify-between agp-2">
            <View>
              <Text className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">
                Expenses
              </Text>
              <Text className="text-lg font-extrabold text-foreground mt-2">
                {user?.currency?.symbol || "$"}
                {expense.toFixed(2)}
              </Text>
            </View>
            <View className="size-8 rounded-2xl bg-red-500/10 items-center justify-center">
              <Icon name="ArrowDownRight" size={18} color="#EF4444" />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};
