import { View } from "react-native";
import { Skeleton } from "../ui/skeleton";

export const ListSkeleton = () => {
  return (
    <View className="gap-4 mb-4">
      {[1, 2, 3, 4].map((item) => (
        <View
          key={item}
          className="flex-row items-center gap-4 border-2 border-border rounded-xl p-2"
        >
          <Skeleton className="size-14" />
          <View className="flex-1 gap-2">
            <Skeleton className="w-1/3 h-6" />
            <Skeleton className="w-2/3 h-6" />
          </View>
        </View>
      ))}
    </View>
  );
};
