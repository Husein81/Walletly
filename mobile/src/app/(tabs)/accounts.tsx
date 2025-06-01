// Global imports
import { useFocusEffect } from "expo-router";
import { use, useCallback, useMemo } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Local imports
import AccountForm from "~/components/Account/AccountForm";
import AccountList from "~/components/Account/AccountList";
import { Text } from "~/components/ui";
import { Button, Empty, ListSkeleton } from "~/components/ui-components";
import { Skeleton } from "~/components/ui/skeleton";
import { formattedBalance } from "~/functions";
import { useGetAccounts } from "~/hooks/accounts";

// store imports
import { useAuthStore, useModalStore } from "~/store";

const Accounts = () => {
  const { user } = useAuthStore();
  const { onOpen } = useModalStore();

  const { data: accounts, refetch } = useGetAccounts(user?.id ?? "");

  useFocusEffect(
    useCallback(() => {
      // Refetch accounts when the screen is focused
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
    <SafeAreaView edges={["top"]} className="mt-14 flex-1 gap-12">
      {totalBalance ? (
        <View className="w-full items-center justify-center">
          <Text className="text-primary text-5xl font-semibold mt-2 ml-2">
            {formattedBalance(totalBalance)}
          </Text>
          <Text className="text-primary text-xl">Total Balance</Text>
        </View>
      ) : totalBalance === 0 ? (
        <View className="w-full items-center justify-center">
          <Text className="text-primary text-5xl font-semibold mt-2 ml-2">
            {formattedBalance(0)}
          </Text>
          <Text className="text-primary text-xl">Total Balance</Text>
        </View>
      ) : (
        <View className="w-full items-center justify-center">
          <Skeleton className="w-1/2 h-8 rounded-full" />
          <Skeleton className="w-1/4 h-6 rounded-full mt-2" />
        </View>
      )}

      <View className="rounded-t-3xl bg-background flex-1 px-6 shadow-lg">
        <Text className="text-3xl font-semibold text-primary text-start mb-4">
          My wallets
        </Text>

        <View className="flex-1">
          {accounts && accounts.length > 0 ? (
            <AccountList accounts={sortedAccountsByDate} />
          ) : accounts && accounts.length === 0 ? (
            <Empty
              title="No accounts found"
              description="Add your first account to get started"
              icon="Info"
            />
          ) : (
            <ListSkeleton />
          )}
        </View>

        <Button className="rounded-xl mb-4" onPress={handleOpenForm}>
          <Text className="text-secondary uppercase font-semibold">
            add new account
          </Text>
        </Button>
      </View>
    </SafeAreaView>
  );
};
export default Accounts;
