import { useState, type FormEvent } from "react";
import type { Category, CreateExpenseRequest } from "../../services/expense";
import {
  getTodayDate,
  toCreateExpenseRequest,
  validateExpenseForm,
  type ExpenseFormErrors,
  type ExpenseFormValues,
} from "../../validations/expense";

type ExpenseFormProps = {
  categories: Category[];
  isCategoriesLoading: boolean;
  categoriesError?: string;
  isSubmitting: boolean;
  submitError?: string;
  onCancel: () => void;
  onSubmit: (input: CreateExpenseRequest) => Promise<boolean>;
};

const initialValues = (): ExpenseFormValues => ({
  amount: "",
  categoryId: "",
  date: getTodayDate(),
  note: "",
});

export function ExpenseForm({
  categories,
  isCategoriesLoading,
  categoriesError,
  isSubmitting,
  submitError,
  onCancel,
  onSubmit,
}: ExpenseFormProps) {
  const [values, setValues] = useState<ExpenseFormValues>(initialValues);
  const [errors, setErrors] = useState<ExpenseFormErrors>({});

  const updateField = (field: keyof ExpenseFormValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validation = validateExpenseForm(values);
    setErrors(validation.errors);

    if (!validation.isValid) {
      return;
    }

    const didSubmit = await onSubmit(toCreateExpenseRequest(validation.value));

    if (didSubmit) {
      setValues(initialValues());
      setErrors({});
    }
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit} noValidate>
      {categoriesError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {categoriesError}
        </div>
      ) : null}

      {submitError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {submitError}
        </div>
      ) : null}

      <div>
        <label
          className="mb-2 block text-sm font-medium text-slate-700"
          htmlFor="expense-amount"
        >
          Amount
        </label>
        <input
          id="expense-amount"
          inputMode="decimal"
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          placeholder="450.75"
          value={values.amount}
          onChange={(event) => updateField("amount", event.target.value)}
          aria-invalid={Boolean(errors.amount)}
          aria-describedby={errors.amount ? "expense-amount-error" : undefined}
        />
        {errors.amount ? (
          <p className="mt-1 text-sm text-red-600" id="expense-amount-error">
            {errors.amount}
          </p>
        ) : null}
      </div>

      <div>
        <label
          className="mb-2 block text-sm font-medium text-slate-700"
          htmlFor="expense-category"
        >
          Category
        </label>
        <select
          id="expense-category"
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          value={values.categoryId}
          onChange={(event) => updateField("categoryId", event.target.value)}
          disabled={isCategoriesLoading || categories.length === 0}
          aria-invalid={Boolean(errors.categoryId)}
          aria-describedby={
            errors.categoryId ? "expense-category-error" : undefined
          }
        >
          <option value="">
            {isCategoriesLoading ? "Loading categories..." : "Select category"}
          </option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        {errors.categoryId ? (
          <p className="mt-1 text-sm text-red-600" id="expense-category-error">
            {errors.categoryId}
          </p>
        ) : null}
      </div>

      <div>
        <label
          className="mb-2 block text-sm font-medium text-slate-700"
          htmlFor="expense-date"
        >
          Date
        </label>
        <input
          id="expense-date"
          type="date"
          className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-900 outline-none transition [color-scheme:light] hover:border-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
          max={getTodayDate()}
          value={values.date}
          onChange={(event) => updateField("date", event.target.value)}
          aria-invalid={Boolean(errors.date)}
          aria-describedby={errors.date ? "expense-date-error" : undefined}
        />
        {errors.date ? (
          <p className="mt-1 text-sm text-red-600" id="expense-date-error">
            {errors.date}
          </p>
        ) : null}
      </div>

      <div>
        <label
          className="mb-2 block text-sm font-medium text-slate-700"
          htmlFor="expense-note"
        >
          Note
        </label>
        <textarea
          id="expense-note"
          className="min-h-24 w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          placeholder="Optional note"
          value={values.note}
          onChange={(event) => updateField("note", event.target.value)}
          aria-invalid={Boolean(errors.note)}
          aria-describedby={errors.note ? "expense-note-error" : undefined}
        />
        {errors.note ? (
          <p className="mt-1 text-sm text-red-600" id="expense-note-error">
            {errors.note}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col-reverse gap-3 pt-1 lg:flex-row lg:justify-end">
        <button
          className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-300"
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          className="rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-300 disabled:cursor-not-allowed disabled:bg-emerald-300"
          type="submit"
          disabled={isSubmitting || isCategoriesLoading || categories.length === 0}
        >
          {isSubmitting ? "Saving..." : "Save expense"}
        </button>
      </div>
    </form>
  );
}
