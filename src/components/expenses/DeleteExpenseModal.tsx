import { useCallback, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import showToast from "../../lib/toast";
import {
  expenseQueryKeys,
  getApiErrorMessage,
  useDeleteExpense,
  type Expense,
} from "../../services/expense";

type DeleteExpenseModalProps = {
  expense: Expense | null;
  onClose: () => void;
};

const formatAmount = (amount: string) =>
  `INR ${Number(amount).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export function DeleteExpenseModal({
  expense,
  onClose,
}: DeleteExpenseModalProps) {
  const queryClient = useQueryClient();
  const deleteExpenseMutation = useDeleteExpense(
    () => {
      queryClient.invalidateQueries({ queryKey: expenseQueryKeys.expenses() });
      queryClient.invalidateQueries({ queryKey: expenseQueryKeys.summary });
      onClose();
      showToast("Expense deleted successfully", "success");
    },
    (error) => showToast(getApiErrorMessage(error), "error"),
  );
  const {
    error,
    isError,
    isPending: isDeleting,
    mutateAsync,
    reset,
  } = deleteExpenseMutation;

  useEffect(() => {
    if (expense) {
      reset();
    }
  }, [expense, reset]);

  const handleCancel = useCallback(() => {
    if (!isDeleting) {
      reset();
      onClose();
    }
  }, [isDeleting, onClose, reset]);

  useEffect(() => {
    if (!expense) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleCancel();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [expense, handleCancel]);

  const handleConfirm = async () => {
    if (!expense) {
      return;
    }

    try {
      await mutateAsync(expense.id);
    } catch {
      // Error state is exposed by the mutation and rendered in the modal.
    }
  };

  if (!expense) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50">
      <button
        className="absolute inset-0 h-full w-full cursor-default bg-slate-950/45"
        type="button"
        aria-label="Close delete confirmation"
        onClick={isDeleting ? undefined : handleCancel}
      />
      <section
        className="fixed inset-x-4 top-1/2 mx-auto max-w-md -translate-y-1/2 rounded-2xl bg-white p-5 shadow-2xl lg:p-6"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-expense-title"
        aria-describedby="delete-expense-description"
      >
        <div className="mb-5">
          <p className="text-sm font-medium uppercase tracking-wide text-red-700">
            Confirm delete
          </p>
          <h2
            className="mt-1 text-xl font-semibold text-slate-950"
            id="delete-expense-title"
          >
            Delete this expense?
          </h2>
          <p
            className="mt-2 text-sm text-slate-600"
            id="delete-expense-description"
          >
            This will permanently remove the {expense.category.name} expense for{" "}
            {formatAmount(expense.amount)}.
          </p>
        </div>

        {isError ? (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {getApiErrorMessage(error)}
          </div>
        ) : null}

        <div className="flex flex-col-reverse gap-3 lg:flex-row lg:justify-end">
          <button
            className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-300 disabled:cursor-not-allowed disabled:opacity-60"
            type="button"
            onClick={handleCancel}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300 disabled:cursor-not-allowed disabled:bg-red-300"
            type="button"
            onClick={handleConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete expense"}
          </button>
        </div>
      </section>
    </div>
  );
}