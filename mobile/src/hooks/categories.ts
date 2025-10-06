import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Local imports
import { Category } from "@/types";
import { api } from ".";

const useCategories = (userId: string) => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async (): Promise<Category[]> => {
      const response = await api.get<Category[]>("/category", {
        params: {
          userId,
        },
      });
      return response.data;
    },
  });
};

const useGetCategoryById = (categoryId: string) => {
  return useQuery({
    queryKey: ["category", categoryId],
    queryFn: async (): Promise<Category> => {
      const response = await api.get<Category>(`/category/${categoryId}`);
      return response.data;
    },
  });
};
const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (category: Category): Promise<void> => {
      await api.post<Category>(`/category`, category);
    },
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
    mutationFn: async (category: Category): Promise<void> => {
      await api.put<Category>(`/category/${category.id}`, category);
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error) => {
      console.error("Error updating category:", error);
    },
  });
};

const useDeleteCategory = (categoryId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (): Promise<void> => {
      await api.delete(`/category/${categoryId}`);
    },
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
