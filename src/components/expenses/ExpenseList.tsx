import type { Expense } from "../../services/expense";

type ExpenseListProps = {
  expenses: Expense[];
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  errorMessage?: string;
  onDeleteRequest: (expense: Expense) => void;
};

const formatAmount = (amount: string) =>
  `INR ${Number(amount).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));

function ListSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          className="h-24 animate-pulse rounded-xl border border-slate-200 bg-white"
          key={index}
        />
      ))}
    </div>
  );
}

export function ExpenseList({
  expenses,
  isLoading,
  isFetching,
  isError,
  errorMessage,
  onDeleteRequest,
}: ExpenseListProps) {
  if (isLoading) {
    return <ListSkeleton />;
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
        {errorMessage ?? "Unable to load expenses"}
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">
        <h3 className="text-base font-semibold text-slate-950">
          No expenses found
        </h3>
        <p className="mt-2 text-sm text-slate-500">
          Add an expense or adjust the filters to see results here.
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      {isFetching ? (
        <div className="absolute right-3 top-3 z-10 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 shadow-sm">
          Updating
        </div>
      ) : null}

      <div className="space-y-3 lg:hidden">
        {expenses.map((expense) => (
          <article
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
            key={expense.id}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  {expense.category.name}
                </p>
                <h3 className="mt-1 text-lg font-semibold text-slate-950">
                  {formatAmount(expense.amount)}
                </h3>
              </div>
              <p className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                {formatDate(expense.expenseDate)}
              </p>
            </div>
            <p className="mt-3 text-sm text-slate-600">
              {expense.note ?? "No note"}
            </p>
            <button
              className="mt-4 w-full rounded-lg border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-200"
              type="button"
              onClick={() => onDeleteRequest(expense)}
            >
              Delete
            </button>
          </article>
        ))}
      </div>

      <div className="hidden overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm lg:block ">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="sticky top-0 z-10 bg-slate-100 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-5 py-3 font-semibold">Date</th>
              <th className="px-5 py-3 font-semibold">Category</th>
              <th className="px-5 py-3 font-semibold">Note</th>
              <th className="px-5 py-3 text-right font-semibold">Amount</th>
              <th className="px-5 py-3 text-right font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {expenses.map((expense) => (
              <tr className="transition hover:bg-slate-50" key={expense.id}>
                <td className="px-5 py-4 text-slate-600">
                  {formatDate(expense.expenseDate)}
                </td>
                <td className="px-5 py-4 font-medium text-slate-950">
                  {expense.category.name}
                </td>
                <td className="max-w-xs px-5 py-4 text-slate-600">
                  <span className="block truncate">
                    {expense.note ?? "No note"}
                  </span>
                </td>
                <td className="px-5 py-4 text-right font-semibold text-slate-950">
                  {formatAmount(expense.amount)}
                </td>
                <td className="px-5 py-4 text-right">
                  <button
                    className="rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-200"
                    type="button"
                    onClick={() => onDeleteRequest(expense)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
