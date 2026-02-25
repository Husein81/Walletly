import { Category } from "@/types";
import { GridSelector } from "./GridSelector";

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
  return (
    <GridSelector<Category>
      title={title}
      data={data}
      numColumns={3}
      selectedId={selectedCategory?.id}
      onSelect={onSelect}
    />
  );
}
