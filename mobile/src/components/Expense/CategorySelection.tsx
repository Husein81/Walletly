import { Category } from "@/types";
import { GridSelector } from "./GridSelector";
import { ScrollView, View } from "react-native";
import { Text } from "../ui";
import { useModalStore } from "@/store";
import CategoryForm from "../Category/CategoryForm";
import { Button } from "../ui-components";

type Props = {
  title: string;
  data: Category[];
  selectedCategory?: Category;
  onSelect: (item: Category) => void;
};

export default function CategorySelection({
  title,
  data,
  selectedCategory,
  onSelect,
}: Props) {
  const { onOpen } = useModalStore();
  return (
    <GridSelector<Category>
      title={title}
      data={data}
      numColumns={3}
      selectedId={selectedCategory?.id}
      onSelect={onSelect}
      action={
        <Button onPress={() => onOpen(<CategoryForm />, "Add Category")}>
          <Text>Add New Category</Text>
        </Button>
      }
    />
  );
}
