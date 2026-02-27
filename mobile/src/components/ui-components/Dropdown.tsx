// Global imports
import { View, Text } from "react-native";

// Local imports
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Icon } from "@/components/ui";
import { useThemeStore } from "@/store/themStore";
import { Button } from "@/components/ui";
import { useState } from "react";

type Option = {
  label: string;
  value: string;
  shortcut?: string;
  onPress?: () => void | React.ReactNode;
};

type Props = {
  title?: string;
  icon?: string;
  options: Option[];
};

export const Dropdown = ({ title, icon, options }: Props) => {
  const { isDark } = useThemeStore();
  const [open, setOpen] = useState(false);
  return (
    <DropdownMenu onOpenChange={(open) => setOpen(!open)} className="relative">
      <DropdownMenuTrigger asChild>
        <Button variant={"ghost"}>
          {title && <Text className="text-primary">{title}</Text>}
          {icon && (
            <Icon
              onPress={() => setOpen(!open)}
              name={icon}
              color={isDark ? "white" : "black"}
            />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="absolute -translate-x-1/3">
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
