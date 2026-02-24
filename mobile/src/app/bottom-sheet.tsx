import { View } from "react-native";
import { useBottomSheetStore } from "@/store";

export default function BottomSheetScreen() {
  const { body } = useBottomSheetStore();

  if (!body) return null;

  return (
    <View className="flex-1 bg-background">
      <View className="p-2">
        <View className="mx-auto w-1/3 h-1 bg-border rounded-full mb-4" />
      </View>
      {body}
    </View>
  );
}
