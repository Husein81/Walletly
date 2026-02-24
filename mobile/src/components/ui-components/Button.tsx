import { ActivityIndicator, Pressable, Text, View } from "react-native";

// local imports
import { Icon } from "@/components/ui";
import { useColorScheme } from "@/lib/useColorScheme";
import { cn } from "@/lib/utils";
import { buttonVariants, Button as SButton } from "../ui/button";
import { VariantProps } from "class-variance-authority";
import { NAV_THEME } from "@/lib/theme";

type Props = {
  onPress?: (args?: any) => void;
  children?: React.ReactNode;
  iconName?: string;
  iconSize?: string;
  text?: string;
  textColor?: string;
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

type ButtonProps = React.ComponentPropsWithoutRef<typeof Pressable> &
  VariantProps<typeof buttonVariants>;

export const Button = ({
  onPress,
  iconName,
  iconSize,
  size,
  text,
  textColor,
  isSubmitting,
  rightIconName,
  variant,
  disabled,
  className,
  children,
}: ButtonProps & Props) => {
  const { isDarkColorScheme } = useColorScheme();

  return (
    <SButton
      size={size}
      variant={variant ?? "default"}
      onPress={onPress}
      className={cn("flex-row gap-2 items-center", className)}
      disabled={disabled}
    >
      {isSubmitting ? (
        <ActivityIndicator
          color={
            isDarkColorScheme
              ? NAV_THEME.dark.colors.background
              : NAV_THEME.light.colors.background
          }
        />
      ) : (
        <>
          {iconName && (
            <Icon
              onPress={onPress}
              name={iconName ?? "default-icon"}
              size={iconSize}
              color={
                isDarkColorScheme
                  ? NAV_THEME.dark.colors.text
                  : NAV_THEME.light.colors.text
              }
            />
          )}
          {children}
          {text && <Text style={{ color: textColor }}>{text}</Text>}
          {rightIconName && (
            <Icon
              onPress={onPress}
              name={rightIconName}
              color={
                isDarkColorScheme
                  ? NAV_THEME.dark.colors.text
                  : NAV_THEME.light.colors.text
              }
            />
          )}
        </>
      )}
    </SButton>
  );
};
