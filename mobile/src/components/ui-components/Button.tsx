import { ActivityIndicator, Text, View } from "react-native";

// local imports
import { Icon } from "~/lib/icons/Icon";
import { useColorScheme } from "~/lib/useColorScheme";
import { cn } from "~/lib/utils";
import { Button as SButton } from "../ui/button";

type Props = {
  onPress?: (args?: any) => void;
  children?: React.ReactNode;
  iconName?: string;
  iconSize?: string;
  text?: string;
  rightIconName?: string;
  isSubmitting?: boolean;
  className?: string;
  disabled?: boolean;
  variant?:
    | "link"
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | null
    | undefined;
};

export const Button = ({
  onPress,
  iconName,
  iconSize,
  text,
  isSubmitting,
  rightIconName,
  variant,
  disabled,
  className,
  children,
}: Props) => {
  const { isDarkColorScheme } = useColorScheme();
  return (
    <SButton
      variant={variant ?? "default"}
      onPress={onPress}
      className={cn("flex-row gap-2 items-center", className)}
      disabled={disabled}
    >
      {isSubmitting ? (
        <ActivityIndicator />
      ) : (
        <>
          {iconName && (
            <Icon
              onPress={onPress}
              name={iconName ?? "default-icon"}
              size={iconSize}
              color={isDarkColorScheme ? "white" : "black"}
            />
          )}
          {children}
          {text && <Text className="text-primary">{text}</Text>}
          {rightIconName && (
            <Icon
              onPress={onPress}
              name={rightIconName}
              color={isDarkColorScheme ? "white" : "black"}
            />
          )}
        </>
      )}
    </SButton>
  );
};
