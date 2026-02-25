import { router } from "expo-router";
import { useEffect } from "react";
import { Pressable, ScrollView, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

// local imports
import { Text } from "@/components/ui";
import { cn } from "@/lib/utils";

// store imports
import { useModalStore } from "@/store";

export default function ModalScreen() {
  const { title, body, transparent, onClose } = useModalStore();

  useEffect(() => {
    return () => {
      onClose();
    };
  }, []);

  const handleClose = () => {
    router.back();
  };

  const Container = transparent ? Pressable : View;

  const containerProps = transparent
    ? { onPress: handleClose }
    : ({} as Record<string, unknown>);

  if (!body) return null;

  return (
    <Container
      {...containerProps}
      className={cn(
        "flex-1 p-6",
        transparent
          ? "bg-black/65 backdrop-blur justify-center items-center"
          : "bg-background",
      )}
    >
      <Animated.View
        entering={transparent ? FadeIn.duration(300) : FadeIn.duration(300)}
        exiting={transparent ? FadeOut.duration(300) : FadeOut.duration(300)}
        className={cn(
          transparent ? "bg-card rounded-xl w-[90%] max-h-[80%] p-4" : "flex-1",
          "gap-4",
        )}
      >
        <SafeAreaView className="flex-1 gap-4">
          {title && (
            <View className="w-full flex-row items-center justify-center">
              <TouchableOpacity
                onPress={handleClose}
                className="absolute left-0"
              >
                <Text className="text-muted-foreground text-sm">Cancel</Text>
              </TouchableOpacity>

              <Text className="text-2xl font-semibold ">{title}</Text>
            </View>
          )}
          <ScrollView className="w-full" showsVerticalScrollIndicator={false}>
            {body}
          </ScrollView>
        </SafeAreaView>
      </Animated.View>
    </Container>
  );
}
