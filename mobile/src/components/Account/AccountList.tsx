import { Account } from "@/types";
import { FlatList, Platform, View } from "react-native";
import AccountCard from "./AccountCard";

type Props = {
  accounts: Account[];
};

const AccountList = ({ accounts }: Props) => {
  return (
    <View className="pt-4 pb-16 gap-4">
      {accounts.map((account) => (
        <AccountCard key={account.id} account={account} />
      ))}
    </View>
  );
};
export default AccountList;
