import { View, Text, SectionList } from "react-native";
import CategoryCard from "./CategoryCard";
import { Category } from "~/types";

type Props = {
  categorySections: Array<{ title: string; data: Category[] }>;
};

const CategorySectionList = ({ categorySections }: Props) => {
  return (
    <SectionList
      sections={categorySections}
      keyExtractor={(item) => item.id || Math.random().toString()}
      stickySectionHeadersEnabled={false}
      showsVerticalScrollIndicator={false}
      ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      renderSectionHeader={({ section: { title } }) => (
        <View className="py-4 gap-2">
          <Text className="text-2xl font-bold text-primary">{title}</Text>
          <View className="w-full mx-auto h-px bg-primary mb-4" />
        </View>
      )}
      renderItem={({ item }) => <CategoryCard category={item} />}
    />
  );
};

export default CategorySectionList;
