import React from "react";
import { View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { formattedBalance } from "@/functions";
import { Icon } from "@/lib/icons/Icon";
import { useColorScheme } from "@/lib/useColorScheme";

export const TransactionsCard = ({
  total,
  expense,
  income,
}: {
  total: number;
  expense: number;
  income: number;
}) => {
  const { isDarkColorScheme } = useColorScheme();

  return (
    <View className="items-center justify-center mb-6">
      {/* Decorative Background Layers - Vercel Gray */}
      <View className="absolute top-[10%] w-72 h-56 rounded-[24px] bg-zinc-900/30 z-0" />
      <View className="absolute top-[5%] w-80 h-56 rounded-[24px] bg-zinc-800/40 z-10" />

      {/* Main Gradient Card - Vercel Black to Gray */}
      <LinearGradient
        colors={
          isDarkColorScheme
            ? ["#101010", "#18181b", "#37373a"]
            : ["#fafafa", "#f4f4f5", "#e4e4e7"]
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          width: "100%",
          maxWidth: 350,
          borderRadius: 24,
          padding: 28,
          shadowColor: "#000000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.25,
          shadowRadius: 12,
          elevation: 8,
          borderWidth: 1,
          borderColor: isDarkColorScheme
            ? "rgba(63, 63, 70, 0.3)"
            : "rgba(228, 228, 231, 0.8)",
        }}
        className="z-20"
      >
        {/* Total Balance Section */}
        <View className="mb-6">
          <View className="flex-row items-center justify-between mb-2">
            <Text
              style={{ color: isDarkColorScheme ? "#a1a1aa" : "#71717a" }}
              className="text-sm font-medium tracking-wide"
            >
              TOTAL BALANCE
            </Text>
            <View
              style={{
                backgroundColor: isDarkColorScheme
                  ? "rgba(63, 63, 70, 0.5)"
                  : "rgba(228, 228, 231, 0.8)",
                borderWidth: 1,
                borderColor: isDarkColorScheme
                  ? "rgba(82, 82, 91, 0.3)"
                  : "rgba(212, 212, 216, 0.8)",
              }}
              className="px-3 py-1 rounded-full"
            >
              <Text
                style={{ color: isDarkColorScheme ? "#e4e4e7" : "#3f3f46" }}
                className="text-xs font-semibold"
              >
                THIS MONTH
              </Text>
            </View>
          </View>
          <Text
            style={{ color: isDarkColorScheme ? "#ffffff" : "#18181b" }}
            className="text-5xl font-bold tracking-tight"
          >
            {formattedBalance(total)}
          </Text>
        </View>

        {/* Income & Expense Cards Row */}
        <View className="flex-row gap-3">
          {/* Income Card - Vercel Blue Accent */}
          <View
            style={{
              backgroundColor: isDarkColorScheme
                ? "rgba(24, 24, 27, 0.8)"
                : "rgba(250, 250, 250, 0.9)",
              borderWidth: 1,
              borderColor: isDarkColorScheme
                ? "rgba(63, 63, 70, 0.5)"
                : "rgba(228, 228, 231, 0.8)",
            }}
            className="flex-1 rounded-2xl p-4"
          >
            <View className="flex-row items-center gap-2 mb-2">
              <View
                style={{
                  backgroundColor: isDarkColorScheme
                    ? "rgba(59, 130, 246, 0.15)"
                    : "rgba(59, 130, 246, 0.1)",
                }}
                className="p-1.5 rounded-lg"
              >
                <Icon size={14} name="TrendingUp" color="#3b82f6" />
              </View>
              <Text
                style={{ color: isDarkColorScheme ? "#d4d4d8" : "#52525b" }}
                className="text-xs font-semibold uppercase tracking-wider"
              >
                Income
              </Text>
            </View>
            <Text
              style={{ color: isDarkColorScheme ? "#ffffff" : "#18181b" }}
              className="text-xl font-bold"
            >
              {formattedBalance(income)}
            </Text>
            <Text
              style={{ color: isDarkColorScheme ? "#71717a" : "#a1a1aa" }}
              className="text-xs mt-1"
            >
              {income > 0 ? "+" : ""}
              {(
                (income / (Math.abs(income) + Math.abs(expense))) * 100 || 0
              ).toFixed(0)}
              %
            </Text>
          </View>

          {/* Expense Card - Vercel Red Accent */}
          <View
            style={{
              backgroundColor: isDarkColorScheme
                ? "rgba(24, 24, 27, 0.8)"
                : "rgba(250, 250, 250, 0.9)",
              borderWidth: 1,
              borderColor: isDarkColorScheme
                ? "rgba(63, 63, 70, 0.5)"
                : "rgba(228, 228, 231, 0.8)",
            }}
            className="flex-1 rounded-2xl p-4"
          >
            <View className="flex-row items-center gap-2 mb-2">
              <View
                style={{
                  backgroundColor: isDarkColorScheme
                    ? "rgba(239, 68, 68, 0.15)"
                    : "rgba(239, 68, 68, 0.1)",
                }}
                className="p-1.5 rounded-lg"
              >
                <Icon size={14} name="TrendingDown" color="#ef4444" />
              </View>
              <Text
                style={{ color: isDarkColorScheme ? "#d4d4d8" : "#52525b" }}
                className="text-xs font-semibold uppercase tracking-wider"
              >
                Expense
              </Text>
            </View>
            <Text
              style={{ color: isDarkColorScheme ? "#ffffff" : "#18181b" }}
              className="text-xl font-bold"
            >
              {formattedBalance(Math.abs(expense))}
            </Text>
            <Text
              style={{ color: isDarkColorScheme ? "#71717a" : "#a1a1aa" }}
              className="text-xs mt-1"
            >
              {expense !== 0 ? "-" : ""}
              {(
                (Math.abs(expense) / (Math.abs(income) + Math.abs(expense))) *
                  100 || 0
              ).toFixed(0)}
              %
            </Text>
          </View>
        </View>

        {/* Balance Indicator Bar - Vercel Blue */}
        <View
          style={{
            backgroundColor: isDarkColorScheme
              ? "rgba(63, 63, 70, 0.5)"
              : "rgba(228, 228, 231, 0.5)",
            height: 6,
            borderRadius: 9999,
            overflow: "hidden",
            marginTop: 16,
          }}
        >
          <View
            style={{
              backgroundColor: "#3b82f6", // Vercel Blue
              height: "100%",
              borderRadius: 9999,
              width: `${
                (income / (Math.abs(income) + Math.abs(expense))) * 100 || 50
              }%`,
            }}
          />
        </View>
      </LinearGradient>
    </View>
  );
};
