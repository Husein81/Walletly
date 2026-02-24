// Global imports
import { Pressable, Text, View } from "react-native";

// Local imports
import { Icon } from "@/components/ui";
import { iconsRecord } from "@/lib/config";
import { cn } from "@/lib/utils";
import { Account } from "@/types";
import { formattedBalance } from "@/utils";
import AccountForm from "./AccountForm";

// Store imports
import { useModalStore } from "@/store";

type Props = {
  account: Account;
};

const AccountCard = ({ account }: Props) => {
  const { onOpen } = useModalStore();

  const handleEdit = () =>
    onOpen(<AccountForm account={account} />, "Edit account");

  return (
    <Pressable
      onPress={handleEdit}
      className="rounded-2xl bg-card p-4 border border-border flex-row items-center gap-2"
    >
      <View className={cn("p-2 rounded-xl bg-primary/10")}>
        <Icon
          name={iconsRecord[account.imageUrl || "other"]}
          color={"#14B8A6"}
        />
      </View>
      <View>
        <Text className="text-lg font-semibold text-foreground capitalize">
          {account.name}
        </Text>
        <View className="flex-row items-center ">
          <Text className={"text-base text-muted-foreground font-semibold"}>
            Balance:{" "}
          </Text>
          <Text className={cn("text-lg text-muted-foreground")}>
            {formattedBalance(account.balance)}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

export default AccountCard;
