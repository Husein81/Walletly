import { useQuery } from "@tanstack/react-query";

// Local imports
import { Category } from "~/types";
import { api } from ".";

const useCategories = (userId: string) => {
  return useQuery({
    queryKey: ["accounts"],
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

export { useCategories };
