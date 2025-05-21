import React from "react";
import { View, Text } from "react-native";
import { formattedBalance } from "~/functions";
import { Icon } from "~/lib/icons/Icon";

const StackedCards = ({
  total,
  expense,
  income,
}: {
  total: number;
  expense: number;
  income: number;
}) => {
  return (
    <View className="flex-1 items-center justify-center relative ">
      <View className="w-80 h-44 rounded-3xl p-4 bg-slate-200 shadow-lg relative z-30 ">
        {/* Total balance */}
        <View className="items-start rounded-3xl ">
          <Text className="text-text text-lg font-semibold ">
            Total Balance
          </Text>
          <Text className="text-text text-3xl ">{formattedBalance(total)}</Text>
        </View>

        <View className="flex-1 px-2 flex-row flex justify-between items-end">
          <View>
            <View className="flex-row items-center gap-2">
              <Icon size={22} name="TrendingUp" />
              <Text className="capitalize text-sm">income</Text>
            </View>
            <Text className="text-lg text-success text-center">
              {formattedBalance(income)}
            </Text>
          </View>
          <View>
            <View className="flex-row items-center gap-2">
              <Icon size={22} name="TrendingDown" />
              <Text className="capitalize text-sm">expense</Text>
            </View>
            <Text className="text-lg text-danger text-center">
              {formattedBalance(expense)}
            </Text>
          </View>
        </View>
      </View>
      {/* Second Layer */}
      <View className="w-72 h-44 rounded-3xl bg-primary/30 absolute top-[15%] z-20" />

      {/* Third Layer */}
      <View className="w-64 h-44 rounded-3xl bg-primary/20 absolute top-[20%] z-10" />
    </View>
  );
};

export default StackedCards;
