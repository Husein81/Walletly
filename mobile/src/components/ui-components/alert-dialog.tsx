import { View, Text } from "react-native";
import { Rn } from "../ui";
import { Button } from "./Button";
import { Icon } from "@/components/ui";

type Props = {
  title: string;
  description?: string;
  action: string;
  icon?: string;
  iconColor?: string;
  onPress: () => void;
};

const AlertDialog = ({
  title,
  description,
  action,
  icon,
  iconColor,
  onPress,
}: Props) => {
  return (
    <Rn.AlertDialog>
      <Rn.AlertDialogTrigger asChild>
        <Button className="mt-4 py-4 border-2 border-destructive bg-destructive/10 rounded-xl items-center">
          {icon && <Icon name={icon} size={20} color={iconColor} />}
          <Text className="text-destructive font-semibold text-base">
            {action}
          </Text>
        </Button>
      </Rn.AlertDialogTrigger>
      <Rn.AlertDialogContent>
        <Rn.AlertDialogTitle>
          <Text className="text-lg font-semibold mb-4">{title}</Text>
        </Rn.AlertDialogTitle>
        <Text className="text-sm text-muted-foreground mb-6">
          {description}
        </Text>
        <View className="flex-row justify-end gap-3">
          <Rn.AlertDialogCancel>
            <Text className="text-sm font-medium text-foreground">Cancel</Text>
          </Rn.AlertDialogCancel>
          <Rn.AlertDialogAction
            className="px-6 py-2 rounded-lg bg-destructive"
            onPress={onPress}
          >
            <Text className="text-sm font-medium text-white">{action}</Text>
          </Rn.AlertDialogAction>
        </View>
      </Rn.AlertDialogContent>
    </Rn.AlertDialog>
  );
};
export default AlertDialog;
