// Global imports
import { useCallback, useMemo } from "react";
import { View, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "expo-router";

// Local imports
import { Text } from "@/components/ui";
import { Icon } from "@/components/ui";
import AccountForm from "@/components/Account/AccountForm";
import { formattedBalance } from "@/utils";
import { useGetAccounts } from "@/hooks/accounts";

// Stores
import { useAuthStore, useModalStore } from "@/store";
import AccountCard from "@/components/Account/AccountCard";
import { Header } from "@/components/ui-components/Header";
import { THEME } from "@/lib/theme";
import { useThemeStore } from "@/store/themStore";

const Accounts = () => {
  const { user } = useAuthStore();
  const { onOpen } = useModalStore();
  const { isDark } = useThemeStore();

  const backgroundColor = isDark
    ? THEME.dark.background
    : THEME.light.background;

  const { data: accounts = [], isLoading } = useGetAccounts(user?.id ?? "");

  // Total balance
  const totalBalance = useMemo(
    () => accounts.reduce((sum, a) => sum + Number(a.balance), 0),
    [accounts],
  );

  // Group balances
  const summary = useMemo(() => {
    return accounts.reduce(
      (acc, account) => {
        const label = account.imageUrl?.toLowerCase() ?? "";
        if (label.includes("card")) acc.credit += Number(account.balance);
        else if (label.includes("piggy"))
          acc.savings += Number(account.balance);
        else acc.checking += Number(account.balance);
        return acc;
      },
      { checking: 0, credit: 0, savings: 0 },
    );
  }, [accounts]);

  const openAddAccount = () => onOpen(<AccountForm />, "Add Wallet");

  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor }}>
      <ScrollView
        className="px-5 bg-background"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        {/* HEADER */}
        <Header
          title="My Wallets"
          subtitle="Manage your cash, cards, and savings"
        />

        {/* TOTAL BALANCE CARD */}
        <View className="mb-6">
          <View className="bg-card border border-border rounded-2xl p-5">
            <Text className="text-muted-foreground text-sm mb-1">
              Total balance
            </Text>

            <Text className="text-foreground text-3xl font-bold mb-4">
              {formattedBalance(totalBalance)}
            </Text>

            <View className="flex-row justify-between">
              <View>
                <Text className="text-muted-foreground/70 text-xs">
                  Cash & Checking
                </Text>
                <Text className="text-muted-foreground font-semibold">
                  {formattedBalance(summary.checking)}
                </Text>
              </View>

              <View>
                <Text className="text-muted-foreground/70 text-xs">
                  Credit available
                </Text>
                <Text className="text-muted-foreground font-semibold">
                  {formattedBalance(summary.credit)}
                </Text>
              </View>

              <View>
                <Text className="text-muted-foreground/70 text-xs">
                  Savings
                </Text>
                <Text className="text-muted-foreground font-semibold">
                  {formattedBalance(summary.savings)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* YOUR ACCOUNTS HEADER */}
        <View className="mb-3 flex-row items-center justify-between">
          <Text className="text-lg font-semibold text-foreground">
            Your accounts
          </Text>

          <Pressable
            onPress={openAddAccount}
            className="flex-row items-center bg-primary rounded-full px-3 py-1"
          >
            <Icon name="Plus" size={16} color="white" />
            <Text className="text-white text-sm font-semibold ml-1">Add</Text>
          </Pressable>
        </View>

        {/* ACCOUNTS LIST */}
        <View className="gap-2">
          {!isLoading && accounts.length === 0 && (
            <View className="items-center mt-16">
              <Text className="text-lg font-semibold text-foreground mb-2">
                No accounts yet
              </Text>
              <Text className="text-sm text-muted-foreground text-center mb-6">
                Create your first wallet to start tracking
              </Text>

              <Pressable
                onPress={openAddAccount}
                className="bg-primary px-6 py-3 rounded-xl"
              >
                <Text className="text-white font-semibold">Create account</Text>
              </Pressable>
            </View>
          )}

          {accounts.map((account) => (
            <AccountCard key={account.id} account={account} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Accounts;
