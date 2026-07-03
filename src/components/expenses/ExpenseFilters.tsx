import { useState, type FormEvent } from "react";
import type { Category, ListExpensesQuery } from "../../services/expense";
import {
  getTodayDate,
  validateExpenseFilters,
} from "../../validations/expense";

type ExpenseFiltersProps = {
  categories: Category[];
  value: ListExpensesQuery;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onApply: (filters: ListExpensesQuery) => void;
  onReset: () => void;
};

const dateInputClass =
  "w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-900 outline-none transition [color-scheme:light] hover:border-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100";

export function ExpenseFilters({
  categories,
  value,
  searchValue,
  onSearchChange,
  onApply,
  onReset,
}: ExpenseFiltersProps) {
  const [draft, setDraft] = useState<ListExpensesQuery>(value);
  const [error, setError] = useState("");


  const updateDraft = (field: keyof ListExpensesQuery, nextValue: string) => {
    setDraft((current) => ({ ...current, [field]: nextValue }));
    setError("");
  };

  const handleApply = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationError = validateExpenseFilters(draft);

    if (validationError) {
      setError(validationError);
      return;
    }

    onApply({
      categoryId: draft.categoryId || undefined,
      from: draft.from || undefined,
      to: draft.to || undefined,
    });
  };

  const handleReset = () => {
    const emptyFilters = {};
    setDraft(emptyFilters);
    setError("");
    onReset();
  };

  return (
    <form
      className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
      onSubmit={handleApply}
    >
      <div className="mb-4">
        <label
          className="mb-1.5 block text-sm font-medium text-slate-700"
          htmlFor="filter-search"
        >
          Search notes
        </label>
        <input
          id="filter-search"
          type="search"
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          placeholder="Search by note keyword"
          maxLength={500}
          value={searchValue}
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
        <div className="lg:flex-1">
          <label
            className="mb-1.5 block text-sm font-medium text-slate-700"
            htmlFor="filter-category"
          >
            Category
          </label>
          <select
            id="filter-category"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            value={String(draft.categoryId ?? "")}
            onChange={(event) => updateDraft("categoryId", event.target.value)}
          >
            <option value="">All categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="lg:flex-1">
          <label
            className="mb-1.5 block text-sm font-medium text-slate-700"
            htmlFor="filter-from"
          >
            From
          </label>
          <input
            id="filter-from"
            type="date"
            className={dateInputClass}
            max={getTodayDate()}
            value={String(draft.from ?? "")}
            onChange={(event) => updateDraft("from", event.target.value)}
          />
        </div>

        <div className="lg:flex-1">
          <label
            className="mb-1.5 block text-sm font-medium text-slate-700"
            htmlFor="filter-to"
          >
            To
          </label>
          <input
            id="filter-to"
            type="date"
            className={dateInputClass}
            max={getTodayDate()}
            value={String(draft.to ?? "")}
            onChange={(event) => updateDraft("to", event.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-2 lg:w-auto">
          <button
            className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-300"
            type="button"
            onClick={handleReset}
          >
            Reset
          </button>
          <button
            className="rounded-lg bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-300"
            type="submit"
          >
            Apply
          </button>
        </div>
      </div>

      {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
    </form>
  );
}

