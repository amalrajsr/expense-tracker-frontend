import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import api from "../config/axios";

export type ApiSuccess<T> = {
  success: true;
  message?: string;
  data: T;
};

export type ApiError = {
  success: false;
  message: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
};

export type Expense = {
  id: string;
  categoryId: string;
  category: Category;
  amount: string;
  expenseDate: string;
  note: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ExpenseSummaryItem = {
  category: Category;
  totalSpend: string;
  expenseCount: number;
};

export type CreateExpenseRequest = {
  amount: string | number;
  categoryId: string | number;
  date: string;
  note?: string | null;
};

export type ListExpensesQuery = {
  categoryId?: string | number;
  from?: string;
  to?: string;
  search?: string;
};

type CategoriesResponse = ApiSuccess<{
  categories: Category[];
}>;

type CreateExpenseResponse = ApiSuccess<{
  expense: Expense;
}>;

type ListExpensesResponse = ApiSuccess<{
  expenses: Expense[];
}>;

type ExpenseSummaryResponse = ApiSuccess<{
  summary: ExpenseSummaryItem[];
}>;

export const expenseQueryKeys = {
  categories: ["categories"] as const,
  expenses: (filters?: ListExpensesQuery) =>
    filters ? (["expenses", filters] as const) : (["expenses"] as const),
  summary: ["expenseSummary"] as const,
};

export const getApiErrorMessage = (error: unknown) => {
  if (axios.isAxiosError<ApiError>(error)) {
    return error.response?.data?.message ?? error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong";
};

const getCategories = async (): Promise<Category[]> => {
  const { data } = await api.get<CategoriesResponse>("/categories");
  return data.data.categories;
};

const getExpenses = async (
  filters: ListExpensesQuery = {},
): Promise<Expense[]> => {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && String(value).trim() !== "") {
      params.set(key, String(value));
    }
  });

  const { data } = await api.get<ListExpensesResponse>("/expenses", {
    params,
  });
  return data.data.expenses;
};

const getExpenseSummary = async (): Promise<ExpenseSummaryItem[]> => {
  const { data } = await api.get<ExpenseSummaryResponse>("/summary");
  return data.data.summary;
};

const createExpense = async (
  input: CreateExpenseRequest,
): Promise<Expense> => {
  const { data } = await api.post<CreateExpenseResponse>("/expenses", input);
  return data.data.expense;
};

const deleteExpense = async (expenseId: string): Promise<null> => {
  const { data } = await api.delete(`/expenses/${expenseId}`);
  return data.data;
};

export const useCategories = () => {
  return useQuery({
    queryKey: expenseQueryKeys.categories,
    queryFn: getCategories,
  });
};

export const useExpenses = (filters: ListExpensesQuery) => {
  return useQuery({
    queryKey: expenseQueryKeys.expenses(filters),
    queryFn: () => getExpenses(filters),
  });
};

export const useExpenseSummary = () => {
  return useQuery({
    queryKey: expenseQueryKeys.summary,
    queryFn: getExpenseSummary,
  });
};

export const useCreateExpense = (
  onSuccess?: () => void,
  onError?: (error: unknown) => void,
) => {
  return useMutation({
    mutationKey: ["createExpense"],
    mutationFn: createExpense,
    onSuccess: () => {
      if (onSuccess) {
        onSuccess();
      }
    },
    onError,
  });
};

export const useDeleteExpense = (
  onSuccess?: () => void,
  onError?: (error: unknown) => void,
) => {
  return useMutation({
    mutationKey: ["deleteExpense"],
    mutationFn: deleteExpense,
    onSuccess: () => {
      if (onSuccess) {
        onSuccess();
      }
    },
    onError,
  });
};

