import { Pressable, ScrollView, Modal as RModal, View } from "react-native";

// local imports
import useModalStore from "~/store/modalStore";
import { Card, Text } from "../ui";
import { cn } from "~/lib/utils";

export const Modal = () => {
  const { open, title, body, transparent } = useModalStore();

  return (
    <RModal
      transparent={transparent}
      visible={open}
      animationType={transparent ? "fade" : "slide"}
    >
      <Pressable
        className={cn(
          "flex-1 z-50 items-center justify-center bg-background ",
          transparent && "bg-black/50"
        )}
        onPress={useModalStore.getState().onClose}
      >
        <View
          className={cn(
            " p-4 ",
            transparent && "w-4/5 rounded-lg bg-card elevation-md"
          )}
        >
          {title && (
            <Text className="text-2xl font-semibold mb-4">{title}</Text>
          )}
          <ScrollView className="max-h-[60vh]">{body}</ScrollView>
        </View>
      </Pressable>
    </RModal>
  );
};
