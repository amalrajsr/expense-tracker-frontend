import { useState } from "react";
import { getApiErrorMessage, useExpenseSummary } from "../../services/expense";

type CategorySummaryProps = {
  className?: string;
  variant?: "panel" | "disclosure";
};

const formatAmount = (amount: string) =>
  `INR ${Number(amount).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const joinClassNames = (...classNames: Array<string | undefined>) =>
  classNames.filter(Boolean).join(" ");

export function CategorySummary({
  className,
  variant = "panel",
}: CategorySummaryProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const summaryQuery = useExpenseSummary();
  const summary = summaryQuery.data ?? [];
  const maxSpend = Math.max(
    ...summary.map((item) => Number(item.totalSpend)),
    0,
  );
  const totalSpend = summary.reduce(
    (total, item) => total + Number(item.totalSpend),
    0,
  );

  const renderSummaryContent = (showTotalCard: boolean) => (
    <>
      {summaryQuery.isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div className="space-y-2" key={index}>
              <div className="h-4 w-28 animate-pulse rounded bg-slate-200" />
              <div className="h-2.5 animate-pulse rounded bg-slate-100" />
            </div>
          ))}
        </div>
      ) : null}

      {summaryQuery.isError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {getApiErrorMessage(summaryQuery.error)}
        </div>
      ) : null}

      {!summaryQuery.isLoading && !summaryQuery.isError ? (
        <div className="space-y-4">
          {showTotalCard ? (
            <div className="rounded-lg bg-slate-950 p-4 text-white">
              <p className="text-sm text-slate-300">Total tracked</p>
              <p className="mt-1 text-2xl font-semibold">
                {formatAmount(String(totalSpend))}
              </p>
            </div>
          ) : null}

          {summary.length > 0 ? (
            summary.map((item) => {
              const amount = Number(item.totalSpend);
              const width =
                maxSpend > 0 ? Math.max((amount / maxSpend) * 100, 4) : 4;

              return (
                <div key={item.category.id}>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {item.category.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {item.expenseCount} expenses
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-slate-950">
                      {formatAmount(item.totalSpend)}
                    </p>
                  </div>
                  <div className="h-2.5  rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-emerald-500"
                      style={{ width: `${width}%` }}
                    />
                  </div>
                </div>
              );
            })
          ) : (
            <p className="rounded-lg border border-dashed border-slate-200 p-4 text-sm text-slate-500">
              No category totals yet.
            </p>
          )}
        </div>
      ) : null}
    </>
  );

  if (variant === "disclosure") {
    const detailsId = "mobile-category-summary-details";

    return (
      <section
        className={joinClassNames(
          "overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm",
          className,
        )}
      >
        <button
          aria-controls={detailsId}
          aria-expanded={isExpanded}
          className="flex w-full items-center justify-between gap-4 p-4 text-left transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-emerald-300"
          type="button"
          onClick={() => setIsExpanded((current) => !current)}
        >
          <span>
            <span className="block text-xs font-medium uppercase tracking-wide text-emerald-700">
              All-time
            </span>
            <span className="mt-1 block text-base font-semibold text-slate-950">
              Category summary
            </span>
            {summaryQuery.isFetching && !summaryQuery.isLoading ? (
              <span className="mt-1 block text-xs font-semibold text-emerald-700">
                Updating
              </span>
            ) : null}
          </span>

          <span className="shrink-0 text-right">
            <span className="block text-sm font-semibold text-slate-950">
              {summaryQuery.isLoading
                ? "Loading..."
                : summaryQuery.isError
                  ? "Unavailable"
                  : formatAmount(String(totalSpend))}
            </span>
            <span className="mt-1 block text-xs font-medium text-slate-500">
              {isExpanded ? "Hide details" : "View details"}
            </span>
          </span>
        </button>

        {isExpanded ? (
          <div className="border-t border-slate-100 p-4" id={detailsId}>
            {renderSummaryContent(false)}
          </div>
        ) : null}
      </section>
    );
  }

  return (
    <aside
      className={joinClassNames(
        "rounded-xl border border-slate-200 bg-white shadow-sm lg:min-h-0 lg:overflow-hidden",
        className,
      )}
    >
      <div className="border-b border-slate-100 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-emerald-700">
              All-time
            </p>
            <h2 className="mt-1 text-lg font-semibold text-slate-950">
              Category summary
            </h2>
          </div>
          {summaryQuery.isFetching && !summaryQuery.isLoading ? (
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              Updating
            </span>
          ) : null}
        </div>
      </div>

      <div className="scrollbar-hide p-5 lg:min-h-0 lg:flex-1 lg:overflow-y-auto">
        {renderSummaryContent(true)}
      </div>
    </aside>
  );
}
