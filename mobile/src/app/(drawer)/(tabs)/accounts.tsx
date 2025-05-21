// Global imports
import { useMemo } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Local imports
import AccountForm from "~/components/Account/AccountForm";
import AccountList from "~/components/Account/AccountList";
import { Text } from "~/components/ui";
import { Button } from "~/components/ui-components";
import { Empty, ListSkeleton } from "~/components/ui-components";
import { Skeleton } from "~/components/ui/skeleton";
import { formattedBalance } from "~/functions";
import { useGetAccounts } from "~/hooks/accounts";
import { useColorScheme } from "~/lib/useColorScheme";

// store imports
import { useAuthStore } from "~/store/authStore";
import useModalStore from "~/store/modalStore";

const Accounts = () => {
  const { isDarkColorScheme } = useColorScheme();
  const { user } = useAuthStore();
  const { onOpen } = useModalStore();

  const { data: accounts } = useGetAccounts(user?.id ?? "");

  const totalBalance = useMemo(
    () => accounts?.reduce((acc, account) => acc + Number(account.balance), 0),
    [accounts]
  );

  const handleOpenForm = () => onOpen(<AccountForm />, "Add new account");

  return (
    <SafeAreaView edges={["top"]} className="py-2 px-6 flex-1 gap-4">
      {totalBalance ? (
        <View className="w-full items-center justify-center">
          <Text className="text-primary text-5xl font-semibold mt-2 ml-2">
            {formattedBalance(totalBalance)}
          </Text>
          <Text className="text-primary text-xl">Total Balance</Text>
        </View>
      ) : (
        <View className="w-full items-center justify-center">
          <Skeleton className="w-1/2 h-8 rounded-full" />
          <Skeleton className="w-1/4 h-6 rounded-full mt-2" />
        </View>
      )}
      <View className="rounded-t-lg bg-background flex-1">
        <Text className="text-3xl font-semibold text-primary text-start mb-4">
          My wallets
        </Text>

        <View className="flex-1">
          {accounts && accounts.length > 0 ? (
            <AccountList accounts={accounts} />
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
