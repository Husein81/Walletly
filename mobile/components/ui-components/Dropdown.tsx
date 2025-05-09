// Global imports
import { View, Text } from "react-native";

// Local imports
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Icon } from "~/lib/icons/Icon";
import { useColorScheme } from "~/lib/useColorScheme";
import { Button } from "~/components/ui";

type Option = {
  label: string;
  value: string;
  shortcut?: string;
  onPress?: () => void;
};

type Props = {
  title?: string;
  icon?: string;
  options: Option[];
};

export const Dropdown = ({ title, icon, options }: Props) => {
  const { isDarkColorScheme } = useColorScheme();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"ghost"}>
          {title && <Text className="text-primary">{title}</Text>}
          {icon && (
            <Icon name={icon} color={isDarkColorScheme ? "white" : "black"} />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {options.map((option) => (
          <DropdownMenuItem key={option.value} onPress={option.onPress}>
            <Text className="text-primary">{option.label}</Text>
            {option.shortcut && (
              <DropdownMenuShortcut className="text-primary">
                {option.shortcut}
              </DropdownMenuShortcut>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
