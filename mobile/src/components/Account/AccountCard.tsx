// Global imports
import { Pressable, Text, View } from "react-native";

// Local imports
import { formattedBalance, getColorByIndex } from "@/functions";
import { NAV_THEME, iconsRecord } from "@/lib/config";
import { Icon } from "@/lib/icons/Icon";
import { cn } from "@/lib/utils";
import { Account } from "@/types";
import { Card } from "../ui/card";
import AccountForm from "./AccountForm";

// Store imports
import { useColorScheme } from "@/lib/useColorScheme";
import { useModalStore } from "@/store";
import { LinearGradient } from "expo-linear-gradient";

type Props = {
  account: Account;
};

const AccountCard = ({ account }: Props) => {
  const { onOpen } = useModalStore();
  const { isDarkColorScheme } = useColorScheme();

  const handleEdit = () =>
    onOpen(<AccountForm account={account} />, "Edit account");

  const color = getColorByIndex(account.name);

  return (
    <Pressable onPress={handleEdit}>
      <LinearGradient
        colors={
          isDarkColorScheme
            ? ["#101010", "#18181b", "#27272a"]
            : ["#fafafa", "#f4f4f5", "#e4e4e7"]
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          width: "100%",
          maxWidth: 350,
          borderRadius: 14,
          padding: 18,
          shadowColor: "#000000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.25,
          shadowRadius: 12,
          elevation: 2,
          borderWidth: 1,
          borderColor: isDarkColorScheme
            ? "rgba(63, 63, 70, 0.3)"
            : "rgba(228, 228, 231, 0.8)",
        }}
        className="flex-row items-center gap-4 "
      >
        <View
          className={cn("p-2 rounded-xl")}
          style={{ backgroundColor: color }}
        >
          <Icon
            name={iconsRecord[account.imageUrl || "other"]}
            color={
              isDarkColorScheme ? NAV_THEME.dark.primary : NAV_THEME.light.text
            }
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
      </LinearGradient>
    </Pressable>
  );
};

export default AccountCard;
