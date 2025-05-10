// Global imports
import { Image, Text, View } from "react-native";

// Local imports
import { Dropdown } from "~/components/ui-components";
import { cn } from "~/lib/utils";
import { Account } from "~/types";
import { Card } from "../ui/card";
import { useDeleteAccount } from "~/hooks/accounts";
import useModalStore from "~/store/modalStore";
import AccountForm from "./AccountForm";

type Props = {
  account: Account;
};

const AccountCard = ({ account }: Props) => {
  const { onOpen } = useModalStore();
  const deleteAccount = useDeleteAccount(account.id ?? "");

  const handleDelete = async () => await deleteAccount.mutateAsync();

  const handleEdit = () =>
    onOpen(<AccountForm account={account} />, "Edit account");

  const formattedBalance = (balance: number) =>
    balance > 0
      ? `$${balance.toFixed(2)}`
      : `-$${Math.abs(balance).toFixed(2)}`;

  const options = [
    {
      label: "Edit",
      value: "edit",
      onPress: handleEdit,
    },
    {
      label: "Delete",
      value: "delete",
      onPress: handleDelete,
    },
  ];

  return (
    <Card className="flex-row gap-4 py-2 px-3 items-center justify-between dark:border-primary dark:bg-darkShark">
      <View className="flex-row gap-4 items-center">
        <Image
          source={{
            uri: account.imageUrl || "https://via.placeholder.com/150",
          }}
          className="size-14 rounded border border-primary"
        />
        <View>
          <Text className="text-lg font-semibold text-primary capitalize">
            {account.name}
          </Text>
          <View className="flex-row items-center ">
            <Text className={"text-lg text-primary font-semibold"}>
              Balance:{" "}
            </Text>
            <Text
              className={cn(
                "text-lg",
                account.balance > 0 ? "text-success" : "text-danger"
              )}
            >
              {formattedBalance(account.balance)}
            </Text>
          </View>
        </View>
      </View>
      <Dropdown icon="Ellipsis" options={options} />
    </Card>
  );
};

export default AccountCard;
