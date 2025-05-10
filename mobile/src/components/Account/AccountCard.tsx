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
import { iconsRecord } from "~/lib/icons/constants";
import { useColorScheme } from "~/lib/useColorScheme";
import { getColorByIndex } from "~/lib/functions";
import { NAV_THEME } from "~/lib/constants";
import { Icon } from "~/lib/icons/Icon";

type Props = {
  account: Account;
};

const AccountCard = ({ account }: Props) => {
  const { onOpen } = useModalStore();
  const { isDarkColorScheme } = useColorScheme();

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
  const color = getColorByIndex(account.name);

  return (
    <Card className="flex-row gap-4 py-2 px-3 items-center justify-between dark:border-primary bg-card">
      <View className="flex-row gap-4 items-center">
        <View
          className={cn("p-2 rounded-lg")}
          style={{ backgroundColor: color }}
        >
          <Icon
            name={iconsRecord[account.imageUrl || "other"]}
            color={
              isDarkColorScheme
                ? NAV_THEME.light.primary
                : NAV_THEME.dark.primary
            }
            size={32}
          />
        </View>
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
