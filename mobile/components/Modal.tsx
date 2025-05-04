import { View, Text } from "react-native";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTrigger,
} from "./ui/alert-dialog";

type Props = {
  trigger: React.ReactNode;
  children: React.ReactNode;
};
const Modal = ({ trigger, children }: Props) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent className="w-full">{children}</AlertDialogContent>
    </AlertDialog>
  );
};
export default Modal;
