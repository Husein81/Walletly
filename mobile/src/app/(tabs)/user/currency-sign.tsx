import React from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { router } from "expo-router";
import { useAuthStore } from "@/store";
import { useUpdateProfile } from "@/hooks/auth";
import { Icon } from "@/components/ui";
import { cn } from "@/lib/utils";
import { CURRENCIES } from "@/constants";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CurrencySignScreen() {
  const { user } = useAuthStore();
  const updateProfile = useUpdateProfile();

  const handleSelect = async (code: string) => {
    if (!user?.id) return;
    const currency = CURRENCIES.find((c) => c.code === code);
    if (!currency) return;

    try {
      await updateProfile.mutateAsync({
        userId: user.id,
        currency,
      });
      router.back();
    } catch (error) {
      console.error("Failed to update currency:", error);
    }
  };

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-background">
      <View className="flex-row items-center justify-between px-4 py-4 border-b border-border">
        <TouchableOpacity onPress={() => router.back()} className="p-2">
          <Icon name="ChevronLeft" size={24} color="#9ca3af" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-foreground">Currency</Text>
        <View className="w-10" />
      </View>

      <FlatList
        data={CURRENCIES}
        keyExtractor={(item) => item.code}
        renderItem={({ item }) => {
          const isSelected = user?.currency?.code === item.code;
          return (
            <TouchableOpacity
              onPress={() => handleSelect(item.code)}
              className={cn(
                "flex-row items-center justify-between px-6 py-4 border-b border-border",
                isSelected && "bg-primary/5",
              )}
            >
              <View className="flex-row items-center gap-4">
                <View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center">
                  <Text className="text-lg font-bold text-primary">
                    {item.symbol}
                  </Text>
                </View>
                <View>
                  <Text className="text-base font-medium text-foreground">
                    {item.label}
                  </Text>
                  <Text className="text-xs text-muted-foreground">
                    {item.code}
                  </Text>
                </View>
              </View>
              {isSelected && <Icon name="Check" size={20} color="#14B8A6" />}
            </TouchableOpacity>
          );
        }}
      />
    </SafeAreaView>
  );
}
