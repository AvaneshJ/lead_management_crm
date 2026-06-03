"use client";

export default function StatsWidgets({ stats = [] }) {
  const statsMap = stats.reduce((acc, curr) => {
    if (curr._id) acc[curr._id] = curr.count;
    return acc;
  }, {});

  const countNew = statsMap["New"] || 0;
  const countContacted = statsMap["Contacted"] || 0;
  const countQualified = statsMap["Qualified"] || 0;
  const countConverted = statsMap["Converted"] || 0;
  const countLost = statsMap["Lost"] || 0;
  const totalLeads =
    countNew + countContacted + countQualified + countConverted + countLost;

  const totalClosedout = countConverted + countLost;
  const conversionRate =
    totalClosedout > 0
      ? Math.round((countConverted / totalClosedout) * 100)
      : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm">
        <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
          Total Pipeline
        </p>
        <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
          {totalLeads}
        </p>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
          Active customer records
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm">
        <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
          In Progress
        </p>
        <p className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-2">
          {countNew + countContacted + countQualified}
        </p>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
          {countNew} New · {countContacted} Contact · {countQualified} Qual
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm">
        <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
          Converted Wins
        </p>
        <p className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-2">
          {countConverted}
        </p>
        <p className="text-xs text-emerald-500/80 dark:text-emerald-400/80 font-medium mt-1">
          {countLost} Closed out as lost
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm">
        <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
          Conversion Rate
        </p>
        <p className="text-3xl font-extrabold text-amber-600 dark:text-amber-400 mt-2">
          {conversionRate}%
        </p>
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
          <div
            className="bg-amber-500 dark:bg-amber-400 h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(conversionRate, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
}
