// Global imports
import { useMemo } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Local imports
import AccountForm from "~/components/Account/AccountForm";
import AccountList from "~/components/Account/AccountList";
import { Button, Text } from "~/components/ui";
import ListSkeleton from "~/components/ui-components/ListSkeleton";
import { useGetAccounts } from "~/hooks/accounts";
import { getColorByIndex } from "~/lib/functions";
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
    () => accounts?.reduce((acc, account) => acc + account.balance, 0),
    [accounts]
  );

  const handleOpenForm = () => onOpen(<AccountForm />, "Add new account");
  const color = useMemo(() => getColorByIndex(user?.name || ""), [user?.name]);

  return (
    <SafeAreaView className="py-4 px-6 flex-1 gap-4">
      <View className="w-full items-center justify-center">
        <Text className="text-primary text-5xl font-semibold mt-2 ml-2">
          ${totalBalance?.toFixed(2)}
        </Text>
        <Text className="text-primary text-xl">Total Balance</Text>
      </View>
      <View className="rounded-t-lg bg-background flex-1">
        <Text className="text-2xl font-semibold text-primary text-start mb-8">
          My wallets
        </Text>

        <View className="flex-1">
          {accounts ? <AccountList accounts={accounts} /> : <ListSkeleton />}
        </View>

        <View>
          <Button className="rounded-xl" onPress={handleOpenForm}>
            <Text className="text-secondary uppercase font-semibold">
              add new account
            </Text>
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
};
export default Accounts;
