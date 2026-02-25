import { View } from "react-native";
import { useBottomSheetStore } from "@/store";
import Animated, { SlideInUp, SlideOutDown } from "react-native-reanimated";

export default function BottomSheetScreen() {
  const { body } = useBottomSheetStore();

  if (!body) return null;

  return (
    <Animated.View
      entering={SlideInUp.duration(300)}
      exiting={SlideOutDown.duration(300)}
      className="flex-1 bg-background"
    >
      <View className="p-2">
        <View className="mx-auto w-1/3 h-1 bg-border rounded-full mb-4" />
      </View>
      {body}
    </Animated.View>
  );
}
