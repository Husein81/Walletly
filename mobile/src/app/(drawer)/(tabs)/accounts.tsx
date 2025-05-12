// Global imports
import { LinearGradient } from "expo-linear-gradient";
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
  const color = useMemo(() => getColorByIndex(user?.name || ""), [user?.name]);

  return (
    <SafeAreaView className="py-4 px-6 flex-1 gap-4">
      <LinearGradient
        colors={["#c0c4c9ff", "#c0c4c980"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{
          borderRadius: 18,
        }}
        className="w-full h-44 p-5 mb-4"
      >
        <Text className="text-primary text-lg">Total Balance</Text>
        <Text className="text-primary text-4xl font-bold mt-2 ml-2">
          $ {totalBalance?.toFixed(2)}
        </Text>
      </LinearGradient>

      <Text className="text-2xl font-semibold text-primary text-start mb-8">
        Accounts
      </Text>

      <View className="flex-1">
        {accounts ? <AccountList accounts={accounts} /> : <ListSkeleton />}
      </View>

      <Button
        variant={"outline"}
        className="flex-row gap-4 border-primary items-center border-2 "
        onPress={handleOpenForm}
      >
        <Icon
          name="Plus"
          size={20}
          color={isDarkColorScheme ? "white" : "black"}
          className="border rounded-full border-primary"
        />
        <Text className="text-primary uppercase font-semibold">
          add new account
        </Text>
      </Button>
    </SafeAreaView>
  );
};
export default Accounts;
