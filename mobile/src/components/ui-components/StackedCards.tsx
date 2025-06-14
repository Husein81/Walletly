import React from "react";
import { View, Text } from "react-native";
import { formattedBalance } from "~/functions";
import { Icon } from "~/lib/icons/Icon";

export const StackedCards = ({
  total,
  expense,
  income,
}: {
  total: number;
  expense: number;
  income: number;
}) => {
  return (
    <View className="flex-1 items-center justify-center mb-8">
      {/* Third Layer - Farthest Back */}
      <View className="absolute top-[8%] w-64 h-44 rounded-3xl bg-primary/20 z-10" />

      {/* Second Layer */}
      <View className="absolute top-[4%] w-72 h-44 rounded-3xl bg-primary/30 z-20" />

      {/* Main Card */}
      <View className="w-80 h-44 rounded-3xl p-4 dark:bg-iron/95 bg-slate-200 shadow z-30">
        {/* Total Balance */}
        <View className="mb-4">
          <Text className="text-text text-lg font-semibold">Total Balance</Text>
          <Text className="text-text text-3xl">{formattedBalance(total)}</Text>
        </View>

        {/* Income & Expense Section */}
        <View className="flex-row justify-between items-end px-2 flex-1">
          {/* Income */}
          <View>
            <View className="flex-row items-center gap-2">
              <Icon size={18} name="TrendingUp" />
              <Text className="capitalize text-xs">income</Text>
            </View>
            <Text className="text-xl text-success text-center">
              {formattedBalance(income)}
            </Text>
          </View>

          {/* Expense */}
          <View>
            <View className="flex-row items-center gap-2">
              <Icon size={18} name="TrendingDown" />
              <Text className="capitalize text-xs">expense</Text>
            </View>
            <Text className="text-xl text-danger text-center">
              {formattedBalance(expense)}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};
