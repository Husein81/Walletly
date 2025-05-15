import { FlatList, View } from "react-native";
import { Account } from "~/types";
import AccountCard from "./AccountCard";

type Props = {
  accounts: Account[];
};

const AccountList = ({ accounts }: Props) => {
  return (
    <View>
      <FlatList
        data={accounts}
        keyExtractor={(item) => item.id || Math.random().toString()}
        className="gap-4"
        renderItem={({ item }) => <AccountCard account={item} />}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      />
    </View>
  );
};
export default AccountList;
