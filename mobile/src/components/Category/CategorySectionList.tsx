import { View, Text, SectionList } from "react-native";
import CategoryCard from "./CategoryCard";
import { Category } from "~/types";

type Props = {
  categorySections: Array<{ title: string; data: Category[] }>;
};

const CategorySectionList = ({ categorySections }: Props) => {
  return (
    <View>
      <SectionList
        sections={categorySections}
        keyExtractor={(item) => item.id || Math.random().toString()}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        renderSectionHeader={({ section: { title } }) => (
          <View className="first:my-4 mb-8 mt-20">
            <Text className="text-2xl font-bold text-primary">{title}</Text>
            <View className="w-full mx-auto h-px bg-primary my-4" />
          </View>
        )}
        renderItem={({ item }) => <CategoryCard category={item} />}
      />
    </View>
  );
};
export default CategorySectionList;
