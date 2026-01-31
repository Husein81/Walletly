import { formattedBalance } from "@/utils";
import { Icon } from "@/lib/icons/Icon";
import React from "react";
import { Text, View } from "react-native";
import { Rn } from "../ui";

type Props = {
  total: number;
  expense: number;
  income: number;
};

export const TransactionsCard = ({ total, expense, income }: Props) => {
  return (
    <Rn.Card className="mb-6 w-full bg-card rounded-3xl p-6">
      {/* TOTAL */}
      <View className="mb-6">
        <Text className="dark:text-white/80 text-sm">Total balance</Text>
        <Text className="dark:text-white text-3xl font-bold mt-1">
          {formattedBalance(total)}
        </Text>
      </View>

      {/* INCOME / EXPENSE */}
      <View className="flex-row gap-3">
        {/* INCOME */}
        <Rn.Card className="flex-1 rounded-2xl p-4">
          <View className="flex-row items-center gap-2 mb-2">
            <View className="bg-iron/20 p-1.5 rounded-xl">
              <Icon name="TrendingUp" size={14} color="#14b8a6" />
            </View>
            <Text className="text-black dark:text-white text-xs uppercase tracking-wider">
              Income
            </Text>
          </View>

          <Text className="text-black dark:text-white text-xl font-semibold">
            {formattedBalance(income)}
          </Text>
        </Rn.Card>

        {/* EXPENSE */}
        <Rn.Card className="flex-1 rounded-2xl p-4">
          <View className="flex-row items-center gap-2 mb-2">
            <View className="bg-iron/20 p-1.5 rounded-xl">
              <Icon name="TrendingDown" size={14} color="#ef4444" />
            </View>
            <Text className="text-black dark:text-white text-xs uppercase tracking-wider">
              Expense
            </Text>
          </View>

          <Text className="text-black dark:text-white text-xl font-semibold">
            {formattedBalance(Math.abs(expense))}
          </Text>
        </Rn.Card>
      </View>
    </Rn.Card>
  );
};
