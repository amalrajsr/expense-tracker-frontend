import { useEffect } from "react";
import type { Category, CreateExpenseRequest } from "../../services/expense";
import { ExpenseForm } from "./ExpenseForm";

type ExpenseDialogProps = {
  open: boolean;
  categories: Category[];
  isCategoriesLoading: boolean;
  categoriesError?: string;
  isSubmitting: boolean;
  submitError?: string;
  onClose: () => void;
  onSubmit: (input: CreateExpenseRequest) => Promise<boolean>;
};

export function ExpenseDialog({
  open,
  categories,
  isCategoriesLoading,
  categoriesError,
  isSubmitting,
  submitError,
  onClose,
  onSubmit,
}: ExpenseDialogProps) {
  useEffect(() => {
    if (!open) {
      return;
    }
  }, [onClose, open]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50">
      <button
        className="absolute inset-0 h-full w-full cursor-default bg-slate-950/45"
        type="button"
        aria-label="Close add expense dialog"
        onClick={onClose}
      />
      <section
        className="fixed inset-x-0 bottom-0 max-h-[90vh] overflow-y-auto rounded-t-2xl bg-white p-5 shadow-2xl lg:left-1/2 lg:right-auto lg:top-1/2 lg:bottom-auto lg:w-full lg:max-w-xl lg:-translate-x-1/2 lg:-translate-y-1/2 lg:rounded-2xl lg:p-6"
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-expense-title"
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-emerald-700">
              New record
            </p>
            <h2
              className="mt-1 text-xl font-semibold text-slate-950"
              id="add-expense-title"
            >
              Add expense
            </h2>
          </div>
          <button
            className="rounded-full border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-300"
            type="button"
            onClick={onClose}
            aria-label="Close"
          >
            Close
          </button>
        </div>

        <ExpenseForm
          categories={categories}
          isCategoriesLoading={isCategoriesLoading}
          categoriesError={categoriesError}
          isSubmitting={isSubmitting}
          submitError={submitError}
          onCancel={onClose}
          onSubmit={onSubmit}
        />
      </section>
    </div>
  );
}
