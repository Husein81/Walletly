// Global imports
import { useMemo } from "react";
import { View } from "react-native";

// Local imports
import AccountForm from "~/components/Account/AccountForm";
import AccountList from "~/components/Account/AccountList";
import { Button, Text } from "~/components/ui";
import { Modal } from "~/components/ui-components";
import ListSkeleton from "~/components/ui-components/ListSkeleton";
import { useGetAccounts } from "~/hooks/accounts";
import { Icon } from "~/lib/icons/Icon";
import { useColorScheme } from "~/lib/useColorScheme";
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

  return (
    <View className="py-4 px-6 flex-1 gap-4">
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-2xl font-semibold text-primary text-start ">
          All Accounts: ${totalBalance}
        </Text>
      </View>

      <Text className="text-2xl font-semibold text-primary text-start mb-8">
        Accounts
      </Text>
      <View className="flex-1">
        {accounts ? <AccountList accounts={accounts} /> : <ListSkeleton />}
      </View>
      <View className="">
        <Button
          variant={"outline"}
          className="flex-row gap-4 border-primary w-fit "
          onPress={handleOpenForm}
        >
          <Icon
            name="Plus"
            size={20}
            color={isDarkColorScheme ? "white" : "black"}
            className="border rounded-full border-primary"
          />
          <Text className="text-primary uppercase">add new account</Text>
        </Button>
      </View>
    </View>
  );
};
export default Accounts;
