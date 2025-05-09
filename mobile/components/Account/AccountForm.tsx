import { useState } from "react";
import { Text, View } from "react-native";

// Local Imports
import { useCreateAccount, useUpdateAccount } from "~/hooks/accounts";
import { useAuthStore } from "~/store/authStore";
import { Account } from "~/types";
import { Input, Label } from "../ui";
import { AlertDialogAction, AlertDialogCancel } from "../ui/alert-dialog";

type Props = {
  account?: Account;
};

const AccountForm = ({ account }: Props) => {
  const { user } = useAuthStore();
  const [name, setName] = useState(account?.name || "");
  const [balance, setBalance] = useState(account?.balance || 0);

  const { mutateAsync: createAccount } = useCreateAccount({
    name,
    balance,
    imageUrl: "",
    userId: user?.id || "",
  });

  const { mutateAsync: updateAccount } = useUpdateAccount({
    id: account?.id || "",
    name,
    balance,
    userId: user?.id || "",
  });

  const handleSubmit = async () => {
    if (account) {
      await updateAccount();
    } else {
      await createAccount();
    }
  };

  return (
    <View className="">
      <Text className="text-primary text-2xl font-semibold mb-4">
        {account ? "Edit account" : "Add new account"}
      </Text>

      <View className="gap-4">
        <Label>Name</Label>
        <Input
          value={name}
          onChangeText={setName}
          placeholder="Account name"
          className="mb-4 dark:bg-darkShark"
        />
      </View>
      <View className="gap-4">
        <Label>Balance</Label>
        <Input
          value={balance.toString()}
          onChangeText={(text) => setBalance(parseFloat(text) || 0)}
          keyboardType="numeric"
          className="mb-4 dark:bg-darkShark"
        />
      </View>

      <View className="flex-row gap-4">
        <AlertDialogCancel className="border-primary border">
          <Text className="dark:text-primary">Cancel</Text>
        </AlertDialogCancel>
        <AlertDialogAction onPress={handleSubmit}>
          <Text className="dark:text-shark text-white">Save</Text>
        </AlertDialogAction>
      </View>
    </View>
  );
};
export default AccountForm;
