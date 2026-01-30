import { View, Text } from "react-native";

// Local Imports
import CategoryCard from "./CategoryCard";
import { Category } from "@/types";

type Props = {
  categorySections: Array<{ title: string; data: Category[] }>;
};

const CategorySectionList = ({ categorySections }: Props) => {
  return (
    <View className="pt-4 pb-16">
      {categorySections.map((section) => (
        <View key={section.title} className="mb-8">
          <View className="mb-4">
            <Text className="text-lg font-bold text-foreground">
              {section.title}
            </Text>
          </View>
          <View className="flex-row flex-wrap justify-between">
            {section.data.map((category) => (
              <View key={category.id} className="w-[48%] mb-4">
                <CategoryCard category={category} />
              </View>
            ))}
          </View>
        </View>
      ))}
    </View>
  );
};

export default CategorySectionList;
