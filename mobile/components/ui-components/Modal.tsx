import { View, Text } from "react-native";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";

type Props = {
  trigger: React.ReactNode;
  children: React.ReactNode;
};

export const Modal = ({ trigger, children }: Props) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent className="w-full bg-card">
        {children}
      </AlertDialogContent>
    </AlertDialog>
  );
};
