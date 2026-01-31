import { View, Text } from "react-native";
import { Rn } from "../ui";
type Props = {
  src?: string;
  fallback?: string;
  size?: number;
};
const Avatar = ({ src, fallback, size = 48 }: Props) => {
  return (
    <Rn.Avatar alt="User Avatar" style={{ width: size, height: size }}>
      <Rn.AvatarImage
        source={{ uri: src }}
        style={{ width: size, height: size }}
        className="rounded-full"
      />
      <Rn.AvatarFallback
        style={{ width: size, height: size }}
        className="rounded-full bg-primary flex items-center justify-center border border-primary/30"
      >
        <Text style={{ fontSize: size / 3 }} className="font-bold text-white">
          {fallback}
        </Text>
      </Rn.AvatarFallback>
    </Rn.Avatar>
  );
};
export default Avatar;
