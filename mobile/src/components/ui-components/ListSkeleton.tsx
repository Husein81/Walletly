import { View, Text, FlatList } from "react-native";
import { Skeleton } from "../ui/skeleton";
const ListSkeleton = () => {
  return (
    <View>
      <FlatList
        data={[1, 2, 3, 4]}
        keyExtractor={(item) => item.toString()}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        renderItem={({ item }) => (
          <View className="flex-row items-center gap-4 border-2 border-border rounded-lg p-2">
            <Skeleton className="size-14" />
            <View className="flex-1 gap-2">
              <Skeleton className="w-1/3 h-6" />
              <Skeleton className="w-2/3 h-6" />
            </View>
          </View>
        )}
      />
    </View>
  );
};
export default ListSkeleton;
