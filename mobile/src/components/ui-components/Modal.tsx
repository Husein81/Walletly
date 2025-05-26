import {
  Pressable,
  Modal as RModal,
  SafeAreaView,
  ScrollView,
  View,
} from "react-native";

// local imports
import { cn } from "~/lib/utils";
import { Text } from "../ui";

// store imports
import useModalStore from "~/store/modalStore";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Icon } from "~/lib/icons/Icon";
import { useColorScheme } from "~/lib/useColorScheme";

export const Modal = () => {
  const { open, title, body, transparent, onClose } = useModalStore();
  const { isDarkColorScheme } = useColorScheme();

  return (
    <RModal
      visible={open}
      transparent={transparent}
      presentationStyle={"formSheet"}
      onRequestClose={onClose}
      animationType={transparent ? "fade" : "slide"}
    >
      <GestureHandlerRootView style={{ flex: 1 }}>
        <BottomSheetModalProvider>
          <Pressable
            onPress={transparent ? onClose : undefined}
            className={cn(
              "flex-1 bg-background p-6",
              transparent &&
                "bg-background/65 backdrop-blur justify-center items-center"
            )}
          >
            <View
              className={cn(
                transparent
                  ? "bg-card rounded-xl p-6 w-[90%] max-h-[80%]"
                  : "flex-1",
                "gap-4"
              )}
            >
              {title && (
                <View className="w-full flex-row items-center justify-center">
                  <Icon
                    name="ChevronLeft"
                    size={28}
                    onPress={onClose}
                    className="absolute left-0 bg-primary  rounded-lg"
                    color={isDarkColorScheme ? "#000" : "#fff"}
                  />
                  <Text className="text-2xl font-semibold ">{title}</Text>
                </View>
              )}
              <ScrollView
                className="w-full"
                showsVerticalScrollIndicator={false}
              >
                {body}
              </ScrollView>
            </View>
          </Pressable>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </RModal>
  );
};
