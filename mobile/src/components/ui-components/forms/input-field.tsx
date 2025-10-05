import { Icon } from "@/lib/icons/Icon";
import { AnyFieldApi } from "@tanstack/react-form";
import { useState } from "react";
import { View } from "react-native";
import { TextInputProps } from "react-native/Libraries/Components/TextInput/TextInput";
import { Input, Label } from "../../ui";
import { FieldInfo } from "./FieldInfo";
import { cn } from "@/lib/utils";
import { useColorScheme } from "@/lib/useColorScheme";

type Props = {
  label: string;
  type?: string;
  field: AnyFieldApi;
  icon?: string;
  className?: string;
} & TextInputProps;

const InputField = ({
  label,
  type = "text",
  value,
  field,
  icon,
  className,
  ...props
}: Props) => {
  const { isDarkColorScheme } = useColorScheme();
  const [show, setShow] = useState(false);
  const isPassword = type === "password";
  return (
    <View className="gap-2">
      <Label>{label}</Label>
      <View className="border border-input h-16 py-1 justify-center rounded-2xl overflow-hidden">
        {icon && (
          <Icon
            color={isDarkColorScheme ? "#71717a" : "#a1a1aa"}
            className="z-50 absolute left-3 top-[56%] -translate-y-1/2"
            name={icon}
          />
        )}
        <Input
          className={cn(
            "text-foreground text-xl flex-1 border-0 h-full",
            { "pl-12": icon },
            className
          )}
          value={String(field.state.value)}
          secureTextEntry={isPassword && !show}
          onChangeText={field.handleChange}
          {...props}
        />
        {isPassword && (
          <Icon
            name={show ? "eye-off" : "eye"}
            color={isDarkColorScheme ? "#71717a" : "#a1a1aa"}
            className="absolute right-3 top-1/2 -translate-y-1/2"
            onPress={() => setShow(!show)}
          />
        )}
      </View>
      <FieldInfo field={field} />
    </View>
  );
};
export default InputField;
