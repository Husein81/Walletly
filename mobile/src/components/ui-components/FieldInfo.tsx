// Global imports
import type { AnyFieldApi } from "@tanstack/react-form";
import { View } from "react-native";

// Local imports
import { Text } from "../ui/text";

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
