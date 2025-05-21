import { useQuery } from "@tanstack/react-query";
import { api } from ".";
import { Expense } from "~/types";

const useGetExpenses = (userId: string, year?: string, month?: string) => {
  return useQuery({
    queryKey: ["expenses"],
    queryFn: async (): Promise<Expense[]> => {
      const response = await api.get("/expense", {
        params: {
          userId,
          year,
          month,
        },
      });
      return response.data;
    },
  });
};

export { useGetExpenses };
