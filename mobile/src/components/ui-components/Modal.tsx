import { Modal as RModal, ScrollView, View } from "react-native";

// local imports
import { cn } from "~/lib/utils";
import { Text } from "../ui";

// store imports
import useModalStore from "~/store/modalStore";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export const Modal = () => {
  const { open, title, body, onClose } = useModalStore();

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
              <Text className="text-2xl font-semibold mb-4">{title}</Text>
            )}
            <ScrollView showsVerticalScrollIndicator={false}>{body}</ScrollView>
          </View>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </RModal>
  );
};
