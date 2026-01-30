// Local Imports
import {
  Option,
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  defaultValue?: Option;
  value?: Option;
  options: Option[];
  label?: string;
  placeholder?: string;
  className?: string;
  onValueChange?: (option: Option) => void;
};

export const Selection = ({
  value,
  defaultValue,
  options,
  label,
  placeholder,
  className,
  onValueChange,
}: Props) => {
  const insets = useSafeAreaInsets();
  const contentInsets = {
    top: insets.top,
    bottom: insets.bottom,
    left: 12,
    right: 12,
    zIndex: 100,
  };

  return (
    <Select
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      className="flex-1"
    >
      <SelectTrigger className={cn("w-full", className)}>
        <SelectValue
          className="text-foreground text-sm native:text-lg flex-1"
          placeholder={placeholder || "Select an option"}
        />
      </SelectTrigger>
      <SelectContent insets={contentInsets}>
        {label && (
          <SelectLabel className="text-sm text-muted-foreground">
            {label}
          </SelectLabel>
        )}
        {options.map((option) => (
          <SelectItem
            key={option?.value}
            value={option?.value as string}
            label={option?.label as string}
          />
        ))}
      </SelectContent>
    </Select>
  );
};
