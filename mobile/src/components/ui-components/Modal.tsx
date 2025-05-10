import { Pressable, ScrollView, Modal as RModal } from "react-native";

// local imports
import useModalStore from "~/store/modalStore";
import { Card, Text } from "../ui";

export const Modal = () => {
  const { open, onClose, title, body } = useModalStore();

  return (
    <RModal transparent visible={open} animationType={"fade"}>
      <Pressable className="flex-1 z-50 items-center justify-center bg-black/80">
        <Card className="w-4/5 bg-card p-4 rounded-lg elevation-md">
          {title && (
            <Text className="text-2xl font-semibold mb-4">{title}</Text>
          )}
          <ScrollView className="max-h-[60vh]">{body}</ScrollView>
        </Card>
      </Pressable>
    </RModal>
  );
};
