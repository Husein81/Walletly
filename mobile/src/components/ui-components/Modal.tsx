import { Pressable, Modal as RModal, ScrollView, View } from "react-native";

// local imports
import { cn } from "~/lib/utils";
import { Text } from "../ui";

// store imports
import useModalStore from "~/store/modalStore";

export const Modal = () => {
  const { open, title, body, onClose } = useModalStore();

  return (
    <RModal
      visible={open}
      hardwareAccelerated={true}
      navigationBarTranslucent={true}
      presentationStyle={"formSheet"}
      onRequestClose={onClose}
      animationType={"slide"}
    >
      <View
        className={cn("flex-1 p-8 items-center justify-center bg-background")}
      >
        {title && <Text className="text-2xl font-semibold mb-4">{title}</Text>}
        <ScrollView>{body}</ScrollView>
      </View>
    </RModal>
  );
};
