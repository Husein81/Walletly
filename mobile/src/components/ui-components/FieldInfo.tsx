import type { AnyFieldApi } from "@tanstack/react-form";
import { Text } from "../ui/text";
import { View } from "react-native";

export function FieldInfo({ field }: { field: AnyFieldApi }) {
  return (
    <View>
      {field.state.meta.isTouched && !field.state.meta.isValid ? (
        <Text className="text-danger text-sm italic">
          {field.state.meta.errors.map((e) => e.message).join(" ")}
        </Text>
      ) : null}
      <Text className="italic text-sm">
        {field.state.meta.isValidating ? "Validating..." : null}
      </Text>
    </View>
  );
}
