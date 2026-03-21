import { router } from "expo-router";
import { useEffect } from "react";
import { Platform, Pressable, ScrollView, View } from "react-native";
import Animated, {
  Easing,
  FadeIn,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

// local imports
import { Icon, Text } from "@/components/ui";
import { cn } from "@/lib/utils";

// store imports
import { useModalStore } from "@/store";
import { SafeAreaView } from "react-native-safe-area-context";

const OPEN_DURATION = 260;
const CLOSE_DURATION = 260;

export default function ModalScreen() {
  const { title, body, closing, onClose, finalizeClose, resetModal } =
    useModalStore();
  const progress = useSharedValue(1);

  useEffect(() => {
    progress.value = withTiming(0, {
      duration: OPEN_DURATION,
      easing: Easing.out(Easing.cubic),
    });
  }, [progress]);

  useEffect(() => {
    if (!closing) return;

    progress.value = withTiming(
      1,
      {
        duration: CLOSE_DURATION,
        easing: Easing.in(Easing.cubic),
      },
      (finished) => {
        if (finished) {
          runOnJS(finalizeClose)();
        }
      },
    );
  }, [closing, finalizeClose, progress]);

  useEffect(() => {
    return () => {
      resetModal();
    };
  }, [resetModal]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: 1 - progress.value * 0.2,
    transform: [{ translateY: progress.value * 36 }],
  }));

  if (!body) return null;

  return (
    <Animated.View
      entering={FadeIn.duration(OPEN_DURATION)}
      className={cn("flex-1 bg-background")}
    >
      <Animated.View
        style={animatedStyle}
        pointerEvents={closing ? "none" : "auto"}
        className={cn("flex-1 p-6 bg-background")}
      >
        <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
          {title && (
            <View className="w-full flex-row items-center justify-center">
              {router.canGoBack() && (
                <Pressable onPress={onClose} className="absolute left-0">
                  {Platform.OS === "ios" ? (
                    <View className="bg-black/10 border border-border p-2 rounded-full">
                      <Icon name="ChevronLeft" size={20} color="#666" />
                    </View>
                  ) : (
                    <Text className="text-muted-foreground text-sm">Cancel</Text>
                  )}
                </Pressable>
              )}

              <Text className="text-2xl font-semibold ">{title}</Text>
            </View>
          )}
          <ScrollView className="w-full" showsVerticalScrollIndicator={false}>
            {body}
          </ScrollView>
        </SafeAreaView>
      </Animated.View>
    </Animated.View>
  );
}
