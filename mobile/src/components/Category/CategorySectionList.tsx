import { View, Text, SectionList, Platform } from "react-native";

// Local Imports
import CategoryCard from "./CategoryCard";
import { Category } from "@/types";
import { Separator } from "../ui";

type Props = {
  categorySections: Array<{ title: string; data: Category[] }>;
};

const CategorySectionList = ({ categorySections }: Props) => {
  return (
    <View className="pt-4 pb-16 gap-4">
      {categorySections.map((section) => (
        <View key={section.title}>
          <View className="py-4 gap-2">
            <Text className="text-2xl font-bold text-primary">
              {section.title}
            </Text>
            <Separator />
          </View>
          {section.data.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </View>
      ))}
    </View>
  );
};

export default CategorySectionList;
