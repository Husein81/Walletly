import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { PortalHost } from "@rn-primitives/portal";
import { Pressable, Modal as RModal, ScrollView, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

// local imports
import { Icon } from "@/lib/icons/Icon";
import { cn } from "@/lib/utils";
import { Text } from "../ui";

// store imports
import { useColorScheme } from "@/lib/useColorScheme";
import { useModalStore } from "@/store";
import { SafeAreaView } from "react-native-safe-area-context";

export const Modal = () => {
  const { open, title, body, transparent, onClose } = useModalStore();
  const { isDarkColorScheme } = useColorScheme();

  const Container = transparent ? Pressable : View;

  const containerProps = transparent
    ? { onPress: onClose }
    : ({} as Record<string, any>);

  return (
    <RModal
      visible={open}
      transparent={transparent}
      presentationStyle={transparent ? "overFullScreen" : "formSheet"}
      onRequestClose={onClose}
      animationType={transparent ? "fade" : "slide"}
    >
      <GestureHandlerRootView style={{ flex: 1 }}>
        <BottomSheetModalProvider>
          <Container
            {...containerProps}
            className={cn(
              "flex-1 p-6",
              transparent
                ? "bg-black/65 backdrop-blur justify-center items-center"
                : "bg-background"
            )}
          >
            <SafeAreaView
              className={cn(
                transparent
                  ? "bg-card rounded-xl w-[90%] max-h-[80%] p-4"
                  : "flex-1",
                "gap-4"
              )}
            >
              {title && (
                <View className="w-full flex-row items-center justify-center">
                  <Pressable
                    onPress={onClose}
                    className="bg-card rounded-full p-2 border border-border absolute left-0"
                  >
                    <Icon
                      name="ChevronLeft"
                      color={isDarkColorScheme ? "#71717a" : "#a1a1aa"}
                      size={24}
                      onPress={onClose}
                      className="text-foreground"
                    />
                  </Pressable>
                  <Text className="text-2xl font-semibold ">{title}</Text>
                </View>
              )}
              <ScrollView
                className="w-full"
                showsVerticalScrollIndicator={false}
              >
                {body}
              </ScrollView>
            </SafeAreaView>
          </Container>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>

      <PortalHost />
    </RModal>
  );
};
