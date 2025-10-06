// Global imports
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect } from "expo-router";
import { useCallback, useMemo } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Local imports
import AccountForm from "@/components/Account/AccountForm";
import AccountList from "@/components/Account/AccountList";
import { Text } from "@/components/ui";
import { ListSkeleton } from "@/components/ui-components";
import { Skeleton } from "@/components/ui/skeleton";
import { formattedBalance } from "@/functions";
import { useGetAccounts } from "@/hooks/accounts";

// store imports
import { useAuthStore, useModalStore } from "@/store";
import { useColorScheme } from "@/lib/useColorScheme";

const Accounts = () => {
  const { user } = useAuthStore();
  const { onOpen } = useModalStore();
  const { isDarkColorScheme } = useColorScheme();

  const { data: accounts, refetch } = useGetAccounts(user?.id ?? "");

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch, accounts])
  );

  const totalBalance = useMemo(
    () => accounts?.reduce((acc, account) => acc + Number(account.balance), 0),
    [accounts]
  );

  const sortedAccountsByDate = useMemo(() => {
    if (!accounts) return [];

    return [...accounts].sort((a, b) => {
      const aDate = new Date(a.createdAt ?? 0).getTime();
      const bDate = new Date(b.createdAt ?? 0).getTime();
      return bDate - aDate; // descending order
    });
  }, [accounts]);

  const handleOpenForm = () => onOpen(<AccountForm />, "Add new account");

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-background">
      <ScrollView
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Quick Add Account Card */}
        <View className="px-5 pt-6 pb-2">
          <Pressable onPress={handleOpenForm}>
            <LinearGradient
              colors={["#10b981", "#059669"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                borderRadius: 20,
                padding: 24,
                shadowColor: "#10b981",
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.3,
                shadowRadius: 16,
                elevation: 8,
              }}
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <Text className="text-white text-xl font-bold mb-1">
                    Create Wallet
                  </Text>
                  <Text className="text-white/80 text-sm">
                    Track your balances and transactions
                  </Text>
                </View>
                <View className="bg-white/20 p-4 rounded-2xl">
                  <Text className="text-white text-2xl">💼</Text>
                </View>
              </View>
            </LinearGradient>
          </Pressable>
        </View>

        {/* Total Balance Card */}
        <View className="px-5 pt-4 pb-2">
          <LinearGradient
            colors={
              isDarkColorScheme
                ? ["#202020", "#28282b", "#37373a"]
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
              elevation: 4,
              borderWidth: 1,
              borderColor: isDarkColorScheme
                ? "rgba(63, 63, 70, 0.3)"
                : "rgba(228, 228, 231, 0.8)",
            }}
          >
            <Text className="text-muted-foreground text-sm font-medium mb-2">
              TOTAL BALANCE
            </Text>
            {totalBalance !== undefined ? (
              <Text className="text-foreground text-4xl font-bold mb-3">
                {formattedBalance(totalBalance)}
              </Text>
            ) : (
              <Skeleton className="w-3/4 h-12 rounded-xl bg-muted/30 mb-3" />
            )}
            <View className="flex-row items-center gap-2">
              <View className="bg-primary/10 px-3 py-1.5 rounded-full">
                <Text className="text-primary text-xs font-semibold">
                  {accounts?.length || 0} Account
                  {accounts?.length !== 1 ? "s" : ""}
                </Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* My Wallets Section */}
        <View className="px-5 mt-6">
          <View className="flex-row items-center justify-between mb-4">
            <View>
              <Text className="text-foreground text-2xl font-bold">
                My Wallets
              </Text>
              <Text className="text-muted-foreground text-sm mt-1">
                {accounts?.length || 0} active wallet
                {accounts?.length !== 1 ? "s" : ""}
              </Text>
            </View>
            <Pressable
              onPress={handleOpenForm}
              className="bg-green-500/80 px-4 py-2 rounded-full active:scale-95"
            >
              <Text className="text-primary text-sm font-semibold">+ Add</Text>
            </Pressable>
          </View>

          {accounts && accounts.length > 0 ? (
            <AccountList accounts={sortedAccountsByDate} />
          ) : accounts && accounts.length === 0 ? (
            <View className="items-center py-16">
              <LinearGradient
                colors={["#d1fae5", "#a7f3d0"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  borderRadius: 100,
                  padding: 32,
                  marginBottom: 16,
                }}
              >
                <Text className="text-7xl">💼</Text>
              </LinearGradient>
              <Text className="text-foreground text-xl font-bold mb-2">
                No Accounts Yet
              </Text>
              <Text className="text-muted-foreground text-center px-8 mb-8">
                Create your first wallet to start tracking your finances
              </Text>
              <Pressable onPress={handleOpenForm} className="active:scale-95">
                <LinearGradient
                  colors={["#10b981", "#059669"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{
                    borderRadius: 16,
                    paddingVertical: 14,
                    paddingHorizontal: 32,
                  }}
                >
                  <Text className="text-white text-base font-semibold">
                    Create Your First Wallet
                  </Text>
                </LinearGradient>
              </Pressable>
            </View>
          ) : (
            <ListSkeleton />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
export default Accounts;
