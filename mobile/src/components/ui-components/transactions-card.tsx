import { formattedBalance } from "@/functions";
import { Icon } from "@/lib/icons/Icon";
import React from "react";
import { Text, View } from "react-native";

type Props = {
  total: number;
  expense: number;
  income: number;
};

export const TransactionsCard = ({ total, expense, income }: Props) => {
  return (
    <View className="px-5 mb-6 w-full">
      {/* MAIN CARD */}
      <View className="bg-primary rounded-3xl p-6">
        {/* TOTAL */}
        <View className="mb-6">
          <Text className="text-white/80 text-sm">Total balance</Text>
          <Text className="text-white text-4xl font-bold mt-1">
            {formattedBalance(total)}
          </Text>
        </View>

        {/* INCOME / EXPENSE */}
        <View className="flex-row gap-3">
          {/* INCOME */}
          <View className="flex-1 bg-white/15 rounded-2xl p-4">
            <View className="flex-row items-center gap-2 mb-2">
              <View className="bg-white/20 p-1.5 rounded-lg">
                <Icon name="TrendingUp" size={14} color="#ffffff" />
              </View>
              <Text className="text-white/80 text-xs uppercase tracking-wider">
                Income
              </Text>
            </View>

            <Text className="text-white text-xl font-semibold">
              {formattedBalance(income)}
            </Text>
          </View>

          {/* EXPENSE */}
          <View className="flex-1 bg-white/15 rounded-2xl p-4">
            <View className="flex-row items-center gap-2 mb-2">
              <View className="bg-white/20 p-1.5 rounded-lg">
                <Icon name="TrendingDown" size={14} color="#ffffff" />
              </View>
              <Text className="text-white/80 text-xs uppercase tracking-wider">
                Expense
              </Text>
            </View>

            <Text className="text-white text-xl font-semibold">
              {formattedBalance(Math.abs(expense))}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};
