import { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { CategorySummary } from "./components/expenses/CategorySummary";
import { DeleteExpenseModal } from "./components/expenses/DeleteExpenseModal";
import { ExpenseDialog } from "./components/expenses/ExpenseDialog";
import { ExpenseFilters } from "./components/expenses/ExpenseFilters";
import { ExpenseList } from "./components/expenses/ExpenseList";
import { useDebounce } from "./hooks/useDebounce";
import showToast from "./lib/toast";
import {
  expenseQueryKeys,
  getApiErrorMessage,
  useCategories,
  useCreateExpense,
  useDeleteExpense,
  useExpenses,
  useExpenseSummary,
  type CreateExpenseRequest,
  type Expense,
  type ListExpensesQuery,
} from "./services/expense";

function App() {
  const queryClient = useQueryClient();
  const [appliedFilters, setAppliedFilters] = useState<ListExpensesQuery>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [expensePendingDelete, setExpensePendingDelete] =
    useState<Expense | null>(null);
  const debouncedSearchTerm = useDebounce(searchTerm.trim(), 400);

  const queryFilters = useMemo<ListExpensesQuery>(
    () => ({
      ...appliedFilters,
      search: debouncedSearchTerm || undefined,
    }),
    [appliedFilters, debouncedSearchTerm],
  );

  const categoriesQuery = useCategories();
  const expensesQuery = useExpenses(queryFilters);
  const summaryQuery = useExpenseSummary();

  const activeFilterCount = useMemo(
    () =>
      Object.values(queryFilters).filter(
        (value) => value !== undefined && String(value).trim() !== "",
      ).length,
    [queryFilters],
  );

  const refreshExpenseData = () => {
    queryClient.invalidateQueries({ queryKey: expenseQueryKeys.expenses() });
    queryClient.invalidateQueries({ queryKey: expenseQueryKeys.summary });
  };

  const createExpenseMutation = useCreateExpense(
    () => {
      refreshExpenseData();
      setIsDialogOpen(false);
      showToast("Expense created successfully", "success");
    },
    (error) => showToast(getApiErrorMessage(error), "error"),
  );

  const deleteExpenseMutation = useDeleteExpense(
    () => {
      refreshExpenseData();
      setExpensePendingDelete(null);
      showToast("Expense deleted successfully", "success");
    },
    (error) => showToast(getApiErrorMessage(error), "error"),
  );

  const handleCreateExpense = async (input: CreateExpenseRequest) => {
    try {
      await createExpenseMutation.mutateAsync(input);
      return true;
    } catch {
      return false;
    }
  };

  const handleDeleteRequest = (expense: Expense) => {
    deleteExpenseMutation.reset();
    setExpensePendingDelete(expense);
  };

  const handleCancelDelete = () => {
    if (!deleteExpenseMutation.isPending) {
      deleteExpenseMutation.reset();
      setExpensePendingDelete(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!expensePendingDelete) {
      return;
    }

    try {
      await deleteExpenseMutation.mutateAsync(expensePendingDelete.id);
    } catch {
      // Error state is exposed by the mutation and rendered in the modal.
    }
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setAppliedFilters({});
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-emerald-700">
              ConvertCart
            </p>
            <h1 className="mt-1 text-2xl font-semibold text-slate-950 lg:text-3xl">
              Expense tracker
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              Track daily spending, filter records, and review all-time category
              totals.
            </p>
          </div>

          <button
            className="rounded-lg bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-300"
            type="button"
            onClick={() => setIsDialogOpen(true)}
          >
            Add expense
          </button>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl gap-6 px-4 py-6 lg:h-[calc(100vh-8rem)] lg:grid-cols-3 lg:items-start lg:overflow-hidden lg:px-8">
        <section className="space-y-5 col-span-2 lg:flex lg:h-full lg:min-h-0 lg:flex-col lg:space-y-0 lg:gap-5 lg:overflow-hidden">
          <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-950">Expenses</h2>
              <p className="mt-1 text-sm text-slate-500">
                {activeFilterCount > 0
                  ? `${activeFilterCount} active filter${
                      activeFilterCount > 1 ? "s" : ""
                    }`
                  : "Showing all recorded expenses"}
              </p>
            </div>
            <p className="text-sm font-medium text-slate-600">
              {expensesQuery.data?.length ?? 0} records
            </p>
          </div>

          <ExpenseFilters
            categories={categoriesQuery.data ?? []}
            value={appliedFilters}
            searchValue={searchTerm}
            onSearchChange={setSearchTerm}
            onApply={setAppliedFilters}
            onReset={handleResetFilters}
          />

          <CategorySummary
            className="lg:hidden"
            variant="disclosure"
            summary={summaryQuery.data ?? []}
            isLoading={summaryQuery.isLoading}
            isFetching={summaryQuery.isFetching}
            isError={summaryQuery.isError}
            errorMessage={getApiErrorMessage(summaryQuery.error)}
          />

          <div className="scrollbar-hide lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:pr-1">
            <ExpenseList
              expenses={expensesQuery.data ?? []}
              isLoading={expensesQuery.isLoading}
              isFetching={expensesQuery.isFetching}
              isError={expensesQuery.isError}
              errorMessage={getApiErrorMessage(expensesQuery.error)}
              deletingId={
                deleteExpenseMutation.isPending
                  ? expensePendingDelete?.id ?? null
                  : null
              }
              onDeleteRequest={handleDeleteRequest}
            />
          </div>
        </section>

        <CategorySummary
          className="hidden lg:flex lg:h-full lg:min-h-0 lg:flex-col"
          variant="panel"
          summary={summaryQuery.data ?? []}
          isLoading={summaryQuery.isLoading}
          isFetching={summaryQuery.isFetching}
          isError={summaryQuery.isError}
          errorMessage={getApiErrorMessage(summaryQuery.error)}
        />
      </main>

      <ExpenseDialog
        open={isDialogOpen}
        categories={categoriesQuery.data ?? []}
        isCategoriesLoading={categoriesQuery.isLoading}
        categoriesError={
          categoriesQuery.isError
            ? getApiErrorMessage(categoriesQuery.error)
            : undefined
        }
        isSubmitting={createExpenseMutation.isPending}
        submitError={
          createExpenseMutation.isError
            ? getApiErrorMessage(createExpenseMutation.error)
            : undefined
        }
        onClose={() => setIsDialogOpen(false)}
        onSubmit={handleCreateExpense}
      />

      <DeleteExpenseModal
        expense={expensePendingDelete}
        isDeleting={deleteExpenseMutation.isPending}
        errorMessage={
          deleteExpenseMutation.isError
            ? getApiErrorMessage(deleteExpenseMutation.error)
            : undefined
        }
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}

export default App;
