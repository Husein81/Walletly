import { Modal as RModal, ScrollView, View } from "react-native";

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
  const { open, title, body, onClose } = useModalStore();
  const { isDarkColorScheme } = useColorScheme();

  return (
    <RModal
      visible={open}
      presentationStyle={"formSheet"}
      onRequestClose={onClose}
      animationType={"slide"}
    >
      <GestureHandlerRootView style={{ flex: 1 }}>
        <BottomSheetModalProvider>
          <View
            className={cn(
              "flex-1 gap-4 p-8 items-center justify-center bg-background"
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
            <ScrollView className="w-full" showsVerticalScrollIndicator={false}>
              {body}
            </ScrollView>
          </View>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </RModal>
  );
};
