import { View, Text } from "react-native";
import { Label } from "../../ui/label";
import { Textarea } from "../../ui/textarea";
import { FieldInfo } from "./FieldInfo";
import { AnyFieldApi } from "@tanstack/react-form";
import { TextInputProps } from "react-native";

type Props = {
  label: string;
  field: AnyFieldApi;
} & TextInputProps;

const TextareaField = ({ label, field, ...props }: Props) => {
  return (
    <View className="gap-2 w-full">
      <Label>{label}</Label>
      <Textarea
        className="rounded-xl text-foreground text-xl flex-1"
        placeholder={props.placeholder}
        value={field.state.value}
        onChangeText={field.handleChange}
        {...props}
      />
      <FieldInfo field={field} />
    </View>
  );
};
export default TextareaField;
