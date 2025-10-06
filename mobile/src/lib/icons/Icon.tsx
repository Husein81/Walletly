import { icons, LucideProps } from "lucide-react-native";
import { Pressable } from "react-native";

interface IconProps extends LucideProps {
  name: string;
  className?: string;
  onPress?: () => void;
}

export const Icon = ({ name, color, size, className, onPress }: IconProps) => {
  const LucideIcon = icons[name as keyof typeof icons];
  if (!LucideIcon) {
    throw new Error(
      `Icon "${name}" does not exist in lucide-react-native library.`
    );
  }
  return (
    <Pressable className={className} onPress={onPress}>
      <LucideIcon color={color} size={size} />
    </Pressable>
  );
};
