import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Local imports
import { Category } from "@/types";
import { api } from ".";
import { categoryApi } from "@/api/category";

const useCategories = (userId: string) => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => categoryApi.getCategories(userId),
  });
};

const useGetCategoryById = (categoryId: string) => {
  return useQuery({
    queryKey: ["category", categoryId],
    queryFn: () => categoryApi.getCategory(categoryId),
  });
};
const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: categoryApi.createCategory,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error) => {
      console.error("Error creating category:", error);
    },
  });
};

const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: categoryApi.updateCategory,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error) => {
      console.error("Error updating category:", error);
    },
  });
};

const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: categoryApi.deleteCategory,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error) => {
      console.error("Error deleting category:", error);
    },
  });
};

export {
  useCategories,
  useGetCategoryById,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
};
